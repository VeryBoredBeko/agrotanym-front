import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ImageDTO } from "@/interfaces/image-dto";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(new URL(`${process.env.AUTH_SIGNIN_PATH}`));
  }

  const accessToken = session.accessToken;

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const backendFormData = new FormData();
  backendFormData.append("image", file);

  const result = await fetch(
    "http://localhost:8767/image-service/api/v2/images",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  const data = await result.json();
  const response: ImageDTO = data as ImageDTO;

  return NextResponse.json<ImageDTO>(response); 
}