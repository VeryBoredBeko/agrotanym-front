import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 🔐 Check authentication
  const session = await auth();

  if (!session) {
    // TODO: Add a redirect to sign-in page if needed
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    // 🌐 Call your backend image-service
    const result = await fetch(
      "http://localhost:8767/image-service/api/v2/images",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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

    const imageDTOs = await result.json();

    return NextResponse.json({
      message: "Fetched images successfully!",
      imageDTOs,
    });

  } catch (error) {
    console.error("Unexpected error:", error);

    return NextResponse.json(
      { error: "Something went wrong fetching images", details: String(error) },
      { status: 500 }
    );
  }
}
