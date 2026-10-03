import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/site/logo-path";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const background = await readFile(join(process.cwd(), "src/assets/og-background.jpg"), "base64");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        <img
          src={`data:image/jpeg;base64,${background}`}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 72,
            width: "100%",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="52" height="52" viewBox={LOGO_VIEWBOX}>
              <path d={LOGO_PATH} fill="#ffffff" />
            </svg>
            <span style={{ fontSize: 36, letterSpacing: "-0.03em" }}>{site.name}</span>
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.04em", maxWidth: 640 }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
