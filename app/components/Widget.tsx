"use client";

export default function Widget() {
  return (
    <iframe
      src="https://core.falconmail.online/widget"
      style={{
        border: "none",
        width: "360px",
        maxWidth: "100vw",
        height: "90vh",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        borderRadius: "20px",
        overflow: "hidden",
      }}
      allowTransparency={true}
      title="FalconMail Widget"
    />
  );
}
