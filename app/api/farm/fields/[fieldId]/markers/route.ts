import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { fieldId: string } }
) {
  const props = await params;
  const fieldId = props.fieldId;

  const session = await auth();

  if (!session || session.error) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const accessToken = session.accessToken;

  const data = await req.json();

  const result = await fetch(
    `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/markers`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!result.ok) {
    const errorText = await result.text();

    return NextResponse.json(
      { error: "Backend error", details: errorText },
      { status: result.status }
    );
  }

  if (result.status === 401) return NextResponse.redirect("/api/auth/signin");

  return NextResponse.json({ status: 200 });
}
