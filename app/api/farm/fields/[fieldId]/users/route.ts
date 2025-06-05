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
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/users`,
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
        { error: "Something went wrong fetching images" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({data: data});

  } catch (error) {
    
    return NextResponse.json(
      { error: "Something went wrong fetching images", details: String(error) },
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
  if (!session) redirect("/api/auth/signin");

  const accessToken = session.accessToken;

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/users?userId=${userId}`,
      {
        method: "POST",
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
        { error: "Something went wrong fetching images" },
        { status: 500 }
      );
    }

    return NextResponse.json({status: 200});

  } catch (error) {
    
    return NextResponse.json(
      { error: "Something went wrong fetching images", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fieldId: Number } }
) {
  const props = await params;
  const fieldId = props.fieldId;

  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  const accessToken = session.accessToken;

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/users?userId=${userId}`,
      {
        method: "DELETE",
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
        { error: "Something went wrong while deleting user access to field." },
        { status: 500 }
      );
    }

    return NextResponse.json({status: 200});

  } catch (error) {
    
    return NextResponse.json(
      { error: "Something went wrong while deleting user access to field.", details: String(error) },
      { status: 500 }
    );
  }
}
