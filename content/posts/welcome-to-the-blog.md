---
title: Welcome to the blog
description: A first post that shows the markdown format, supported metadata, and the clean presentation this site is built around.
date: "2026-03-18"
slug: welcome-to-the-blog
---

# Welcome to the blog

This site reads markdown files from the repo and turns them into static pages. The frontmatter at the top of each file is the full content contract for a post:

```yaml
title: Welcome to the blog
description: A short summary used on the home page and in metadata.
date: 2026-03-18
slug: welcome-to-the-blog
```

## What works well here

- Plain markdown files committed alongside the code
- A clean homepage listing every post
- Build-time validation for required metadata
- A lightweight path for importing posts from Notion markdown later

## Markdown examples

Inline code like `yarn build` uses IBM Plex Mono, and fenced blocks do too:

```ts
export function hello(name: string) {
  return `Hello, ${name}`;
}
```

Task lists and tables come through with GFM support:

- [x] Read local markdown files
- [x] Render a static homepage
- [ ] Write the next post

| Field | Purpose |
| --- | --- |
| `title` | Displayed on the home page and post page |
| `description` | Used for the preview text |
| `date` | Controls ordering and display |
| `slug` | Defines the URL |

And local public images can be embedded with root-relative paths:

![Starter illustration](/nick.jpg)
