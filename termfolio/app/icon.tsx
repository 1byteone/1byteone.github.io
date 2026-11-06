import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0f",
          borderRadius: "6px",
        }}
      >
        <pre
          style={{
            color: "#7dd3fc",
            fontFamily: "monospace",
            fontSize: "8px",
            lineHeight: "1.0",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          {`█╗╔█╗\n██╔██║\n╚╝ ╚╝`}
        </pre>
      </div>
    ),
    { ...size }
  )
}
