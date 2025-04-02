import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  const formData = await req.formData();
  console.log(formData);

  const result = await fetch(
    "http://localhost:8767/forum-service/posts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // ⚠️ DO NOT manually set Content-Type when using FormData.
        // fetch will automatically set the correct Content-Type with boundary.
      },
      body: JSON.stringify({title: formData.get("title"), content: formData.get("content")}),
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