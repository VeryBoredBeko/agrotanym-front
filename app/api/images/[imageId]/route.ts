import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { imageId: string } }
) {
  const imageId = (await params).imageId;

  if (!imageId)
    return NextResponse.json({ error: "ImageID have to be specified!" });

  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL(`${process.env.AUTH_SIGNIN_PATH}`));
  }

  const accessToken = session.accessToken;

  try {
    const result = await fetch(
      `${process.env.IMAGE_SERVICE_URL}/api/v2/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!result.ok) {
      const error = await result.json();
      return NextResponse.json(
        { error: "Error while connecting to Image-Service:", details: error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong fetching images", details: String(error) },
      { status: 500 }
    );
  }
}
