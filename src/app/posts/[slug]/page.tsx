import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { formatPostDate, getAllPostSlugs, getPostBySlug } from "@/lib/posts";
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

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-8">
        <div className="space-y-4">
          <Link
            className="inline-flex text-sm text-muted-foreground transition-opacity hover:opacity-70"
            href="/"
          >
            Back to all posts
          </Link>

          <header className="space-y-4 border-b border-border pb-8">
            <p className="text-sm text-muted-foreground">
              {formatPostDate(post.date)}
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
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
