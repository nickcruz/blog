---
name: blog-post-import
description: Use when the user wants to create a new blog post in this repo from pasted Notion markdown or markdown containing remote images; infer metadata, confirm title/description/date/slug, download remote images into `public/posts/<slug>/`, rewrite markdown image URLs, and write the final post to `content/posts/<slug>.md`.
---

# Blog Post Import

Use this skill when the user pastes markdown and wants it turned into a new post for this repo.

## Workflow

1. Reuse the pasted markdown from the conversation when available. If it is missing, ask the user to paste it.
2. Infer:
   - `title` from the first H1
   - `description` from the first meaningful paragraph
   - `slug` from the title
3. Ask the user to confirm or supply `title`, `description`, `date`, and `slug` before writing files.
4. Save the pasted markdown to a temp file under `tmp/blog-post-import/`.
5. From the repo root, run `node scripts/import-blog-post.mjs --input <temp-file> --title <title> --description <description> --date <YYYY-MM-DD> --slug <slug>`.
6. Check that the script created:
   - `content/posts/<slug>.md`
   - `public/posts/<slug>/...`
7. Remove the temp file if it was created only for the import.

## Rules

- Keep the output as plain markdown, not MDX.
- Use root-relative image URLs like `/posts/<slug>/image-01.jpg`.
- Do not use the Notion API.
- Do not assume an exported asset folder exists.
- If downloading remote images requires network approval, request it before running the script.
