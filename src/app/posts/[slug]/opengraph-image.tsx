import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { formatPostDate, getPostBySlug } from "@/lib/posts";
import { getOgFonts } from "@/lib/og-font";
import { siteConfig } from "@/lib/site";

type PostImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const alt = "Blog post Open Graph image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function PostOpenGraphImage({ params }: PostImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const fonts = await getOgFonts();

  if (!post) {
    notFound();
  }

  return new ImageResponse(
    <div
      style={{
        background: "#f6efe7",
        color: "#0a0908",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        fontFamily: '"IBM Plex Sans", sans-serif',
        border: "1px solid #22333b",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#22333b",
          }}
        >
          <span>{siteConfig.siteUrl.replace("https://", "")}</span>
          <span>{formatPostDate(post.date)}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              marginLeft: -4,
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
              color: "#22333b",
            }}
          >
            {post.description}
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "18px",
          background: "#f25f5c",
        }}
      />
    </div>,
    {
      ...size,
      fonts,
    },
  );
}
