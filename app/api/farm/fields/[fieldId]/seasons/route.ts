"use server";

import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { fieldId: Number } }
) {
  const props = await params;
  const fieldId = props.fieldId;

  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/seasons?page=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      redirect("/api/auth/signin");
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error while fetching field seasons." },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Error while fetching field seasons.", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { fieldId: Number } }
) {
  const props = await params;
  const fieldId = props.fieldId;

  const session = await auth();
  if (!session || session.error) {
    return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
  }

  const accessToken = session.accessToken;

  const values = await request.json();

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/seasons`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    if (response.status === 401) {
      return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error while creating a new seasonal data record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error while creating a new seasonal data record.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
