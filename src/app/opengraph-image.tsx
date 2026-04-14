import { ImageResponse } from "next/og";
import { getOgFonts } from "@/lib/og-font";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.siteName} Open Graph image`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fonts = await getOgFonts();

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
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#22333b",
          }}
        >
          {siteConfig.siteUrl.replace("https://", "")}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "760px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                marginLeft: -4,
              }}
            >
              {siteConfig.home.name}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                fontSize: 38,
                fontWeight: 500,
                lineHeight: 1.35,
                color: "#22333b",
              }}
            >
              {siteConfig.home.rolePrefix}, {siteConfig.home.companyName}
            </div>
          </div>
          <img
            alt={siteConfig.home.portraitAlt}
            height="160"
            src={`${siteConfig.siteUrl}/nick.jpg`}
            style={{
              display: "flex",
              width: "160px",
              height: "160px",
              objectFit: "cover",
              border: "1px solid #22333b",
            }}
          />
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
