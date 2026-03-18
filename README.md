# Personal Blog

A minimal Next.js blog that statically renders markdown posts committed in the repo.

## Stack

- Next.js App Router
- Tailwind CSS v4
- IBM Plex Sans for UI and headings
- IBM Plex Mono for markdown code
- shadcn-style `Card` component for the homepage list

## Getting Started

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content Model

Posts live in `content/posts/*.md` and are rendered at build time.

Each post must include this frontmatter:

```md
---
title: "Post title"
description: "Short summary shown on the homepage"
date: "2026-03-18"
slug: "post-title"
---
```

- `title` is used on the homepage and post page
- `description` is the preview text and metadata description
- `date` controls ordering and display format
- `slug` becomes the URL at `/posts/[slug]`

The build will fail for missing metadata, invalid dates, or duplicate slugs.

## Scripts

```bash
yarn dev
yarn lint
yarn build
yarn post:import -- --input tmp/source.md --title "My Post" --description "Short summary" --date "2026-03-18" --slug "my-post"
```

## Importing a Post from Notion Markdown

This repo includes a local Codex skill and a helper script for turning pasted Notion markdown into a post.

- Skill: `.codex/skills/blog-post-import/SKILL.md`
- Script: `scripts/import-blog-post.mjs`

The importer will:

- read markdown from `--input <file>` or stdin
- infer title, description, and slug when possible
- download remote markdown images into `public/posts/<slug>/`
- rewrite markdown image URLs to local site URLs like `/posts/<slug>/image-01.jpg`
- write the finished post to `content/posts/<slug>.md`

Example using stdin:

```bash
cat tmp/source.md | yarn post:import -- --date "2026-03-18"
```

If metadata is still missing after inference, pass it with flags or run the script interactively with `--input`.

## Project Structure

```text
content/posts/          Markdown source for blog posts
public/posts/           Imported post images
scripts/                Blog post import helper
src/app/                App Router pages and layout
src/components/         UI and markdown rendering
src/lib/                Content loading and site config
```
