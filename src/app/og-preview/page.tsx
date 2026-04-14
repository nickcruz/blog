import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPostDate, getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "OG Preview",
  description: "Development preview for Open Graph images.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OpenGraphPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const posts = getAllPosts();
  const previewCardClassName =
    "mx-auto w-full max-w-[820px] overflow-hidden border border-border bg-card p-3 shadow-sm sm:p-4";
  const previewImageClassName =
    "mx-auto h-auto w-full max-w-[760px] border border-border";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <header className="space-y-3 border border-border bg-card p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-secondary">
            Debug Only
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            Open Graph Preview
          </h1>
          <p className="max-w-3xl text-base leading-7 text-secondary">
            This page renders the live Open Graph image routes so you can tune
            the card layout and refresh to review changes.
          </p>
        </header>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">Root page</h2>
            <p className="text-sm text-secondary">
              Approximate in-app share-card scale for visual tuning.
            </p>
          </div>

          <div className={previewCardClassName}>
            <Image
              alt={`${siteConfig.siteName} Open Graph preview`}
              className={previewImageClassName}
              src="/opengraph-image"
              width={1200}
              height={630}
              unoptimized
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">Posts</h2>
            <p className="text-sm text-secondary">
              Each preview uses the live route at
              {" "}
              <code>/posts/[slug]/opengraph-image</code>.
            </p>
          </div>

          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className={`space-y-3 ${previewCardClassName}`}
              >
                <div className="space-y-1 px-1">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-secondary">
                    {formatPostDate(post.date)}
                  </p>
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="text-sm text-secondary">
                    /posts/{post.slug}/opengraph-image
                  </p>
                </div>

                <Image
                  alt={`${post.title} Open Graph preview`}
                  className={previewImageClassName}
                  src={`/posts/${post.slug}/opengraph-image`}
                  width={1200}
                  height={630}
                  unoptimized
                />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
