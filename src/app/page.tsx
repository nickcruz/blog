import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPostDate, getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-8">
        <header className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Personal Writing
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {siteConfig.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {siteConfig.intro}
            </p>
          </div>
        </header>

        <section className="space-y-4">
          {posts.map((post) => (
            <Card key={post.slug} className="transition-colors duration-150 hover:bg-accent/60">
              <Link
                aria-label={`Read ${post.title}`}
                className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                href={`/posts/${post.slug}`}
              >
                <CardHeader className="gap-3">
                  <p className="text-sm text-muted-foreground">
                    {formatPostDate(post.date)}
                  </p>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-7 text-muted-foreground">
                      {post.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
