import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.siteName} Open Graph image`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #f4efe8 0%, #efe4d3 52%, #e5d5bc 100%)",
          color: "#211a13",
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
            fontSize: 28,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <span>{siteConfig.siteName}</span>
          <span>{siteConfig.home.siteLabel}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "920px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            {siteConfig.home.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
              color: "#5b4738",
            }}
          >
            {siteConfig.description}
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
                fontSize: 24,
                color: "#7b604d",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
              }}
            >
              {siteConfig.home.rolePrefix}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 600,
              }}
            >
              {siteConfig.home.companyName}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#7b604d",
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
