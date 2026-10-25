import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY"

export async function GET() {
  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!res.ok) {
      throw new Error(`NASA API returned ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("APOD API error:", error)
    // Fallback static data
    return NextResponse.json({
      title: "The Milky Way over the Spanish Peaks",
      explanation: "The arch of the Milky Way Galaxy stretches across the sky in this wide-angle view from a dark sky location.",
      url: "https://apod.nasa.gov/apod/image/2301/MilkyWaySpanishPeaks_1024.jpg",
      hdurl: "https://apod.nasa.gov/apod/image/2301/MilkyWaySpanishPeaks.jpg",
      date: new Date().toISOString().slice(0, 10),
      media_type: "image",
    })
  }
}
