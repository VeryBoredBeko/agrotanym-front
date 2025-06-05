import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || session.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
  }

  const accessToken = session.accessToken;

  const features = await req.json();

  try {
    const result = await fetch(
      `${process.env.DIRT_DIAGNOSIS_SERVICE_URL}/predict`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
      }
    );

    if (result.status === 401)
      return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);

    if (!result.ok) {
      return NextResponse.json(
        { error: "Error while making POST-request to service." },
        { status: result.status }
      );
    }

    const data = await result.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error while making POST-request to service." },
      { status: 500 }
    );
  }
}
