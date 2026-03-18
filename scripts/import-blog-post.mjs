#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import matter from "gray-matter";

const args = parseArgs(process.argv.slice(2));
const repoRoot = process.cwd();
const contentDirectory = path.join(repoRoot, "content", "posts");
const publicDirectory = path.join(repoRoot, "public", "posts");

async function main() {
  if (args.help) {
    printHelp();
    return;
  }

  const rawInput = await readInput(args.input);
  const { content, data } = matter(rawInput);

  const inferredTitle = firstNonEmptyString(
    args.title,
    getStringValue(data.title),
    inferTitle(content),
  );
  const inferredDescription = firstNonEmptyString(
    args.description,
    getStringValue(data.description),
    inferDescription(content),
  );
  const inferredDate = firstNonEmptyString(
    args.date,
    normalizeDateValue(data.date),
  );
  const inferredSlug = firstNonEmptyString(
    args.slug,
    getStringValue(data.slug),
    inferredTitle ? slugify(inferredTitle) : undefined,
  );

  const metadata = await resolveMetadata({
    title: inferredTitle,
    description: inferredDescription,
    date: inferredDate,
    slug: inferredSlug,
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)) {
    throw new Error(`Invalid date "${metadata.date}". Use YYYY-MM-DD.`);
  }

  const postFilePath = path.join(contentDirectory, `${metadata.slug}.md`);

  if (!args.force && (await pathExists(postFilePath))) {
    throw new Error(
      `Post already exists at "${path.relative(repoRoot, postFilePath)}". Use a different slug or rerun with --force.`,
    );
  }

  const imageDirectory = path.join(publicDirectory, metadata.slug);
  const rewrittenContent = await rewriteRemoteImages(content, {
    imageDirectory,
    imageUrlPrefix: `/posts/${metadata.slug}`,
  });
  const fileBody = serializePost(metadata, rewrittenContent);

  await fs.mkdir(contentDirectory, { recursive: true });
  await fs.writeFile(postFilePath, fileBody, "utf8");

  console.log(`Created ${path.relative(repoRoot, postFilePath)}`);
  console.log(`Images stored in ${path.relative(repoRoot, imageDirectory)}`);
}

function parseArgs(argv) {
  const parsed = {
    input: undefined,
    title: undefined,
    description: undefined,
    date: undefined,
    slug: undefined,
    force: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--force") {
      parsed.force = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      parsed.help = true;
      continue;
    }

    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument "${argument}".`);
    }

    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for "${argument}".`);
    }

    if (argument === "--input") {
      parsed.input = value;
    } else if (argument === "--title") {
      parsed.title = value;
    } else if (argument === "--description") {
      parsed.description = value;
    } else if (argument === "--date") {
      parsed.date = value;
    } else if (argument === "--slug") {
      parsed.slug = value;
    } else {
      throw new Error(`Unknown argument "${argument}".`);
    }

    index += 1;
  }

  return parsed;
}

async function readInput(inputPath) {
  if (inputPath) {
    return fs.readFile(path.resolve(repoRoot, inputPath), "utf8");
  }

  if (!process.stdin.isTTY) {
    const chunks = [];

    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }

    const markdown = chunks.join("").trim();

    if (markdown.length === 0) {
      throw new Error("No markdown received on stdin.");
    }

    return markdown;
  }

  throw new Error("Provide markdown with --input <file> or pipe it in through stdin.");
}

async function resolveMetadata(metadata) {
  const missingFields = Object.entries(metadata)
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length === 0) {
    return metadata;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      `Missing metadata: ${missingFields.join(", ")}. Pass them with flags or use --input from an interactive terminal.`,
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const title = metadata.title ?? (await prompt(rl, "Title"));
    const description =
      metadata.description ?? (await prompt(rl, "Description"));
    const date =
      metadata.date ?? (await prompt(rl, "Date", { defaultValue: today }));
    const slug = metadata.slug ?? (await prompt(rl, "Slug"));

    return {
      title,
      description,
      date,
      slug,
    };
  } finally {
    rl.close();
  }
}

async function prompt(rl, label, options = {}) {
  const suffix = options.defaultValue ? ` [${options.defaultValue}]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();

  return answer || options.defaultValue || "";
}

async function rewriteRemoteImages(markdown, options) {
  const imagePattern =
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g;
  const matches = [...markdown.matchAll(imagePattern)];

  if (matches.length === 0) {
    return markdown.trim();
  }

  await fs.mkdir(options.imageDirectory, { recursive: true });

  const downloadedImages = new Map();
  let rewrittenMarkdown = markdown;
  let imageCount = 0;

  for (const match of matches) {
    const fullMatch = match[0];
    const altText = match[1];
    const sourceUrl = match[2];
    const titleText = match[3];

    let assetPath = downloadedImages.get(sourceUrl);

    if (!assetPath) {
      imageCount += 1;
      assetPath = await downloadImage(sourceUrl, options.imageDirectory, imageCount);
      downloadedImages.set(sourceUrl, assetPath);
    }

    const rewrittenUrl = `${options.imageUrlPrefix}/${path.basename(assetPath)}`;
    const titleSuffix = titleText ? ` "${titleText}"` : "";
    const rewrittenImage = `![${altText}](${rewrittenUrl}${titleSuffix})`;

    rewrittenMarkdown = rewrittenMarkdown.replace(fullMatch, rewrittenImage);
  }

  return rewrittenMarkdown.trim();
}

async function downloadImage(sourceUrl, imageDirectory, index) {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Failed to download image "${sourceUrl}" (${response.status}).`);
  }

  const url = new URL(sourceUrl);
  const extension =
    normalizeExtension(path.extname(url.pathname)) ||
    extensionFromContentType(response.headers.get("content-type")) ||
    ".bin";
  const fileName = `image-${String(index).padStart(2, "0")}${extension}`;
  const filePath = path.join(imageDirectory, fileName);
  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  return filePath;
}

function normalizeExtension(extension) {
  if (!extension) {
    return "";
  }

  const normalized = extension.toLowerCase();

  if (normalized === ".jpeg") {
    return ".jpg";
  }

  return normalized;
}

function extensionFromContentType(contentType) {
  if (!contentType) {
    return "";
  }

  const normalized = contentType.split(";")[0].trim().toLowerCase();
  const mapping = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
  };

  return mapping[normalized] ?? "";
}

function inferTitle(markdown) {
  const match = markdown.match(/^\s*#\s+(.+?)\s*$/m);

  return match?.[1]?.trim();
}

function inferDescription(markdown) {
  const lines = markdown.split(/\r?\n/);
  const paragraphLines = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    if (
      trimmed.length === 0 ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("![") ||
      trimmed.startsWith(">") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      /^\d+\.\s/.test(trimmed)
    ) {
      if (paragraphLines.length > 0) {
        break;
      }

      continue;
    }

    paragraphLines.push(trimmed);
  }

  if (paragraphLines.length === 0) {
    return undefined;
  }

  return truncate(cleanMarkdownText(paragraphLines.join(" ")), 180);
}

function cleanMarkdownText(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function firstNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return undefined;
}

function getStringValue(value) {
  return typeof value === "string" ? value : undefined;
}

function normalizeDateValue(value) {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return undefined;
}

function serializePost(metadata, markdown) {
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(metadata.title)}`,
    `description: ${JSON.stringify(metadata.description)}`,
    `date: ${JSON.stringify(metadata.date)}`,
    `slug: ${JSON.stringify(metadata.slug)}`,
    "---",
    "",
    markdown.trim(),
    "",
  ];

  return frontmatter.join("\n");
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function printHelp() {
  console.log(`Usage:
  node scripts/import-blog-post.mjs --input tmp/source.md --date "2026-03-18"
  cat tmp/source.md | node scripts/import-blog-post.mjs --date "2026-03-18"

Options:
  --input <file>         Read markdown from a file
  --title <value>        Set the post title
  --description <value>  Set the post description
  --date <YYYY-MM-DD>    Set the post date
  --slug <value>         Set the post slug
  --force                Overwrite an existing post file
  --help                 Show this help message
`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
