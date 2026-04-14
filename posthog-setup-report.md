<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your blog with PostHog analytics. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve event reliability. Five custom events are now tracked across two client components and the markdown renderer.

| Event | Description | File |
|---|---|---|
| `post_clicked` | User clicked a blog post card on the home page, entering the reading funnel | `src/components/tracked-post-card.tsx` |
| `social_link_clicked` | User clicked a social profile link (GitHub, LinkedIn, Twitter, Instagram) from the home page sidebar | `src/components/tracked-social-link.tsx` |
| `external_link_clicked` | User clicked an external link inside a blog post's markdown content | `src/components/markdown-renderer.tsx` |
| `image_expanded` | User clicked a post image to expand it in the overlay modal | `src/components/markdown-renderer.tsx` |
| `image_overlay_closed` | User closed the expanded image overlay (via button, click outside, or Escape key) | `src/components/markdown-renderer.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/382231/dashboard/1467853)
- **Post clicks over time**: [View insight](https://us.posthog.com/project/382231/insights/X3Yk7mVY)
- **Most clicked posts**: [View insight](https://us.posthog.com/project/382231/insights/DfuR13dp)
- **Social link clicks by platform**: [View insight](https://us.posthog.com/project/382231/insights/lWhnf3O4)
- **Post-to-external-link funnel**: [View insight](https://us.posthog.com/project/382231/insights/oRkFSpfT)
- **Image engagement rate**: [View insight](https://us.posthog.com/project/382231/insights/KDirka5v)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
