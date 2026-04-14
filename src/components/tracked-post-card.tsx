"use client";

import Link from "next/link";
import posthog from "posthog-js";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TrackedPostCardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  index: number;
  total: number;
  readPostAriaPrefix: string;
  readPostLabel: string;
};

export function TrackedPostCard({
  slug,
  title,
  description,
  date,
  index,
  total,
  readPostAriaPrefix,
  readPostLabel,
}: TrackedPostCardProps) {
  function handleClick() {
    posthog.capture("post_clicked", {
      post_slug: slug,
      post_title: title,
    });
  }

  return (
    <Card className="transition-colors duration-150 hover:border-brand-accent hover:bg-accent">
      <Link
        aria-label={`${readPostAriaPrefix} ${title}`}
        className="block h-full text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        href={`/posts/${slug}`}
        onClick={handleClick}
      >
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-secondary">
              {date}
            </p>
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7 text-secondary">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-4 sm:min-w-28 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-secondary">
              {String(total - index).padStart(2, "0")}
            </p>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-accent">
              {readPostLabel}
            </p>
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}
