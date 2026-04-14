import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { siteConfig } from "@/lib/site";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
};

export type Post = PostFrontmatter & {
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

function assertStringField(
  value: unknown,
  fieldName: keyof PostFrontmatter,
  fileName: string,
) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Post "${fileName}" is missing a valid "${fieldName}" field.`);
  }

  return value.trim();
}

function normalizeDateField(value: unknown, fileName: string) {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Post "${fileName}" is missing a valid "date" field.`);
}

function getDateTimestamp(date: string, fileName: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    throw new Error(
      `Post "${fileName}" has an invalid date "${date}". Use YYYY-MM-DD.`,
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error(
      `Post "${fileName}" has an impossible date "${date}". Use a real calendar date.`,
    );
  }

  return parsedDate.getTime();
}

const loadPosts = cache(() => {
  if (!fs.existsSync(postsDirectory)) {
    return [] as Post[];
  }

  const seenSlugs = new Set<string>();

  const posts = fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort()
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const source = fs.readFileSync(fullPath, "utf8");
      const { content, data } = matter(source);
      const title = assertStringField(data.title, "title", fileName);
      const description = assertStringField(
        data.description,
        "description",
        fileName,
      );
      const date = normalizeDateField(data.date, fileName);
      const slug = assertStringField(data.slug, "slug", fileName);
      const timestamp = getDateTimestamp(date, fileName);

      if (seenSlugs.has(slug)) {
        throw new Error(`Duplicate post slug "${slug}" found in "${fileName}".`);
      }

      seenSlugs.add(slug);

      return {
        title,
        description,
        date,
        slug,
        content: content.trim(),
        timestamp,
      };
    })
    .sort((left, right) => right.timestamp - left.timestamp);

  return posts.map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    slug: post.slug,
    content: post.content,
  }));
});

export function getAllPosts() {
  return loadPosts();
}

export function getAllPostSlugs() {
  return loadPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string) {
  return loadPosts().find((post) => post.slug === slug);
}

function toAbsolutePostAssetUrl(slug: string, assetPath: string) {
  try {
    return new URL(assetPath, `${siteConfig.siteUrl}/posts/${slug}`).toString();
  } catch {
    return assetPath;
  }
}

function rewriteMarkdownImagesToLinks(content: string, slug: string) {
  return content.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (_match, alt: string, source: string) => {
      const label = alt.trim() || "Image";
      const absoluteSource = toAbsolutePostAssetUrl(slug, source.trim());

      return `[${label}](${absoluteSource})`;
    },
  );
}

export function serializePostToMarkdown(post: Post) {
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(post.description)}`,
    `date: ${JSON.stringify(post.date)}`,
    `slug: ${JSON.stringify(post.slug)}`,
    `author: ${JSON.stringify(siteConfig.authorName)}`,
    "---",
  ].join("\n");

  const body = rewriteMarkdownImagesToLinks(post.content, post.slug);
  const header = [
    `# ${post.title}`,
    "",
    post.description,
    "",
    `Author: [${siteConfig.authorName}](${siteConfig.siteUrl})`,
    "",
    post.date,
    "",
    "---",
  ].join("\n");

  return `${frontmatter}\n\n${header}\n\n${body.trim()}\n`;
}

export function formatPostDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(parsedDate);
}
