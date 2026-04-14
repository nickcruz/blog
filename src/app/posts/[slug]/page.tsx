import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PostMarkdownActions } from "@/components/post-markdown-actions";
import { buildPostMetadata } from "@/lib/metadata";
import {
  formatPostDate,
  getAllPostSlugs,
  getPostBySlug,
  serializePostToMarkdown,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  return buildPostMetadata(post);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const markdownHref = `/posts/${post.slug}.md`;
  const markdown = serializePostToMarkdown(post);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-8 lg:py-16">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Link
              className="inline-flex text-sm font-medium uppercase tracking-[0.2em] text-link transition-opacity hover:opacity-70"
              href="/"
            >
              Back to all posts
            </Link>

            <div className="hidden sm:block">
              <PostMarkdownActions markdown={markdown} markdownHref={markdownHref} />
            </div>
          </div>

          <header className="space-y-4 border-b border-border pb-8">
            <p className="text-sm text-secondary">
              {formatPostDate(post.date)}
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-secondary sm:text-lg">
                {post.description}
              </p>
            </div>
          </header>
        </div>

        <article className="markdown">
          <MarkdownRenderer content={post.content} />
        </article>
      </div>
    </main>
  );
}
