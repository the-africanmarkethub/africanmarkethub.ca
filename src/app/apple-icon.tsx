import { ImageResponse } from "next/og";

// Route segment config
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <img
          src={`${
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
          }/icon/logo.svg`}
          alt="African Market Hub"
          width="540"
          height="540"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
