import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(new URL(`${process.env.AUTH_SIGNIN_PATH}`, `${process.env.NEXTAUTH_URL}`));
  }

  const accessToken = session.accessToken;

  const data = await req.json();

  const result = await fetch(
    `${process.env.FORUM_SERVICE_URL}/questions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!result.ok) {
    const errorText = await result.text();

    return NextResponse.json(
      { error: "Error while uploading question to backend.", details: errorText },
      { status: result.status }
    );
  }
  
  const response = await result.json();

  return NextResponse.json({questionId: response.id});
}