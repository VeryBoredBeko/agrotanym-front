"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { Field } from "@/interfaces/field";

export async function GET(
  request: Request,
  { params }: { params: { fieldId: string } }
) {
  const props = await params;
  const fieldId = props.fieldId;

  const session = await auth();
  if (!session || session.error) {
    return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error fetching field: ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = (await response.json()) as Field;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong while fetching the field.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { fieldId: Number } }
) {
  const props = await params;
  const fieldId = props.fieldId;

  const session = await auth();
  if (!session) return NextResponse.redirect("/api/auth/signin");

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      return NextResponse.redirect("/api/auth/signin");
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Something went wrong while deleting field." },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong while deleting field.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
