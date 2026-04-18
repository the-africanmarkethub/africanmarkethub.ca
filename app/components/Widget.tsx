"use client";

export default function Widget() {
  return (
    <iframe
      src="https://core.falconmail.online/widget"
      style={{
        border: "none",
        width: "100%",
        height: "100vh",
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 9999,
      }}
      allowTransparency={true} // In JSX, this is camelCase
      title="FalconMail Widget"
    />
  );
}
