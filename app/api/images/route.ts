import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page") || 0;

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    // 🌐 Call your backend image-service
    const result = await fetch(
      `http://localhost:8767/image-service/api/v2/images?page=${page}`,
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
      status: 200,
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
