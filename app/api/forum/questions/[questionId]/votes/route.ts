import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const questionId = (await params).questionId;

  const searchParams = req.nextUrl.searchParams;
  const voteType = searchParams.get("voteType");

  if (!voteType)
    return NextResponse.json(
      { error: "voteType search parameter is mandatory" },
      { status: 403 }
    );

  if (voteType !== "UP" && voteType !== "DOWN")
    return NextResponse.json(
      { error: "voteType search parameter value can only be UP or DOWN" },
      { status: 403 }
    );

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(
      new URL(`${process.env.AUTH_SIGNIN_PATH}`, `${process.env.NEXTAUTH_URL}`)
    );
  }

  const accessToken = session.accessToken;

  const result = await fetch(
    `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/votes?voteType=${voteType}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!result.ok) {
    const errorText = await result.text();

    return NextResponse.json(
      { error: "Backend error", details: errorText },
      { status: result.status }
    );
  }

  return NextResponse.json({ status: 200 });
}

export async function DELETE (
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const questionId = (await params).questionId;

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(
      new URL(`${process.env.AUTH_SIGNIN_PATH}`, `${process.env.NEXTAUTH_URL}`)
    );
  }

  const accessToken = session.accessToken;

  const result = await fetch(
    `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/votes`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!result.ok) {
    const errorText = await result.text();

    return NextResponse.json(
      { error: "Backend error", details: errorText },
      { status: result.status }
    );
  }

  return NextResponse.json({ status: 200 });
}