"use server";

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { fieldId: Number; fieldSeasonId: Number } }
) {
  const props = await params;
  const fieldId = props.fieldId;
  const fieldSeasonId = props.fieldSeasonId;

  const session = await auth();
  if (!session || session.error) {
    return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
  }

  const accessToken = session.accessToken;

  const values = await request.json();

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/seasons/${fieldSeasonId}`,
      {
        method: "PUT",
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
        { error: "Error while updating field seasonal record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error while updating field seasonal record.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fieldId: Number; fieldSeasonId: Number } }
) {
  const props = await params;
  const fieldId = props.fieldId;
  const fieldSeasonId = props.fieldSeasonId;

  const session = await auth();
  if (!session || session.error) {
    return NextResponse.redirect(`${process.env.AUTH_SIGNIN_PATH}`);
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/seasons/${fieldSeasonId}`,
      {
        method: "DELETE",
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
        { error: "Error while deleting field seasonal record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error while deleting field seasonal record.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
