import Image from "next/image";
import Link from "next/link";
import {
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiTwitterXLine,
} from "react-icons/ri";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPostDate, getAllPosts } from "@/lib/posts";

const homeContent = {
  portraitAlt: "Portrait of Nick Reyes",
  siteLabel: "About",
  name: "Nick Reyes",
  rolePrefix: "Co-Founder",
  companyName: "Leda AI",
  bio: "Writing about engineering, systems, all things tech.",
  readPostLabel: "Read Post",
  readPostAriaPrefix: "Read",
  socialLabels: {
    linkedin: "LinkedIn",
    twitter: "Twitter",
    instagram: "Instagram",
  },
} as const;

const socialLinks = [
  {
    label: homeContent.socialLabels.linkedin,
    href: "https://www.linkedin.com/in/nicolasreyes26",
    Icon: RiLinkedinBoxLine,
  },
  {
    label: homeContent.socialLabels.twitter,
    href: "https://x.com/nickcruz26",
    Icon: RiTwitterXLine,
  },
  {
    label: homeContent.socialLabels.instagram,
    href: "https://www.instagram.com/nick.reyes26",
    Icon: RiInstagramLine,
  },
] as const;

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:gap-12 lg:px-10 lg:py-16">
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="space-y-8 border border-border bg-card p-6 sm:p-8">
            <div className="space-y-6">
              <Image
                alt={homeContent.portraitAlt}
                className="h-28 w-28 border border-border object-cover sm:h-36 sm:w-36"
                height={3000}
                priority
                src="/nick.jpg"
                width={3000}
              />

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.32em] text-secondary">
                    {homeContent.siteLabel}
                  </p>
                  <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                    {homeContent.name}
                  </h1>
                </div>

                <p className="max-w-sm text-base leading-7 text-secondary">
                  {homeContent.rolePrefix}{" "}
                  <a
                    className="font-semibold text-link underline decoration-current/60 underline-offset-4"
                    href="https://askleda.com"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {homeContent.companyName}
                  </a>
                </p>

                <p className="max-w-md text-base leading-7 text-foreground">
                  {homeContent.bio}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  aria-label={label}
                  className="inline-flex h-12 w-12 items-center justify-center border border-border bg-background text-foreground transition-colors duration-150 hover:border-brand-accent hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  href={href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-6 lg:col-span-2">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Card
                key={post.slug}
                className="transition-colors duration-150 hover:border-brand-accent hover:bg-accent"
              >
                <Link
                  aria-label={`${homeContent.readPostAriaPrefix} ${post.title}`}
                  className="block h-full text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  href={`/posts/${post.slug}`}
                >
                  <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-secondary">
                        {formatPostDate(post.date)}
                      </p>
                      <div className="space-y-2">
                        <CardTitle className="text-2xl sm:text-3xl">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="max-w-2xl text-base leading-7 text-secondary">
                          {post.description}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4 sm:min-w-28 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-secondary">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-accent">
                        {homeContent.readPostLabel}
                      </p>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
