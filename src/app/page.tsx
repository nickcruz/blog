import Image from "next/image";
import type { Metadata } from "next";
import { buildRootMetadata } from "@/lib/metadata";
import { formatPostDate, getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { TrackedPostCard } from "@/components/tracked-post-card";
import { TrackedSocialLink } from "@/components/tracked-social-link";

const { home: homeContent } = siteConfig;

const socialLinks = [
  {
    icon: "github",
    label: siteConfig.socialLabels.github,
    href: siteConfig.socialLinks.github,
  },
  {
    icon: "linkedin",
    label: siteConfig.socialLabels.linkedin,
    href: siteConfig.socialLinks.linkedin,
  },
  {
    icon: "twitter",
    label: siteConfig.socialLabels.twitter,
    href: siteConfig.socialLinks.twitter,
  },
  {
    icon: "instagram",
    label: siteConfig.socialLabels.instagram,
    href: siteConfig.socialLinks.instagram,
  },
] as const;

export const metadata: Metadata = buildRootMetadata();

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
                    href={homeContent.companyUrl}
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
              {socialLinks.map(({ href, icon, label }) => (
                <TrackedSocialLink
                  key={label}
                  href={href}
                  icon={icon}
                  label={label}
                />
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-6 lg:col-span-2">
          <div className="space-y-4">
            {posts.map((post, index, array) => (
              <TrackedPostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                description={post.description}
                date={formatPostDate(post.date)}
                index={index}
                total={array.length}
                readPostAriaPrefix={homeContent.readPostAriaPrefix}
                readPostLabel={homeContent.readPostLabel}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
