import type { Metadata } from "next";
import type { Post } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl);
}

export function buildRootMetadata(): Metadata {
  const title = { absolute: siteConfig.title };
  const description = siteConfig.description;
  const canonicalUrl = toAbsoluteUrl("/");
  const imageUrl = toAbsoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: siteConfig.title,
      description,
      siteName: siteConfig.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.siteName} Open Graph image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: siteConfig.title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildPostMetadata(post: Post): Metadata {
  const canonicalPath = `/posts/${post.slug}`;
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imageUrl = toAbsoluteUrl(`${canonicalPath}/opengraph-image`);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: siteConfig.authorName }],
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.description,
      siteName: siteConfig.siteName,
      publishedTime: new Date(`${post.date}T00:00:00.000Z`).toISOString(),
      authors: [siteConfig.authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} Open Graph image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}
