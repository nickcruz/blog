import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { formatPostDate, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type PostImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const alt = `${siteConfig.siteName} post Open Graph image`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function PostOpenGraphImage({ params }: PostImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(160deg, #13110e 0%, #241c15 45%, #473425 100%)",
          color: "#f8f1e7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#d3baa2",
          }}
        >
          <span>{siteConfig.siteName}</span>
          <span>{formatPostDate(post.date)}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#ebd8c6",
            }}
          >
            {post.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#d3baa2",
              }}
            >
              Blog Post
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 600,
              }}
            >
              {siteConfig.authorName}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#d3baa2",
            }}
          >
            {siteConfig.siteUrl.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
