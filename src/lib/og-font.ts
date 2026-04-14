import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

function readFontFile(fileName: string) {
  return fs.readFile(path.join(process.cwd(), "public", "fonts", fileName));
}

export const getOgFonts = cache(async () => {
  const [regular, medium, bold] = await Promise.all([
    readFontFile("IBMPlexSans-Regular.ttf"),
    readFontFile("IBMPlexSans-Medium.ttf"),
    readFontFile("IBMPlexSans-Bold.ttf"),
  ]);

  return [
    {
      name: "IBM Plex Sans",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "IBM Plex Sans",
      data: medium,
      weight: 500 as const,
      style: "normal" as const,
    },
    {
      name: "IBM Plex Sans",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
});
