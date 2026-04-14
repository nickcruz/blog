---
title: Welcome to the blog
description: 👋
date: "2026-03-18"
slug: welcome-to-the-blog
---

Welcome to my blog! If you're into tech, AI, and like to nerd out about stuff, you might be in the right place.

If you're an engineer[-turned-vibe-coder] you are _definitely_ in the right place.

## Why I'm blogging

I'm building a business with my wife and co-founder, [Mika Reyes](https://mikareyes.com/), and we're going to learn _a lot_ of things along the way.

This is here to jot down my thoughts, celebrate wins, and learn about our losses. We're building in public and want a place to share things.

Here's the first micro-post:

## Website stack

This is a `Next.js` app deployed on Vercel and almost entirely vibe-coded. Except for the blog posts.

- Every blog post is a `.md` file.
- Next.js server-side renders the markdown files with `react-markdown` when you go to `/posts/[slug]`.
- I use `rehype` to add syntax highlighting to code blocks.
```ts
export function hello(name: string) {
  return `Hello, ${name}`;
}
```
_Wow, so cool!_

That's it, that's the post.
