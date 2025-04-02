import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Create a new FormData object to send to your backend
  const backendFormData = new FormData();
  backendFormData.append("image", file);

  const result = await fetch(
    "http://localhost:8767/forum-service/posts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // ⚠️ DO NOT manually set Content-Type when using FormData.
        // fetch will automatically set the correct Content-Type with boundary.
      },
      body: backendFormData,
    }
  );

  if (!result.ok) {
    const errorText = await result.text();
    console.error("Backend error:", errorText);

    return NextResponse.json(
      { error: "Backend error", details: errorText },
      { status: result.status }
    );
  }

  let prediction;
  try {
    prediction = result.body;
  } catch (error) {
    const text = result.text();
    console.error("Failed to parse JSON. Raw response:", text);
    return NextResponse.json(
      { error: "Invalid JSON from backend", raw: text },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Сурет сәтті жіберілді! Классификациялау нәтижесі:",
    prediction,
  });
}