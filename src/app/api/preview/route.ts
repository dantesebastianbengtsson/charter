import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const deezerId = request.nextUrl.searchParams.get("id");
  if (!deezerId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.deezer.com/track/${deezerId}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Deezer API error" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({
      previewUrl: data.preview || "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
