"use server";

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { Field } from "@/interfaces/field";

export async function GET(
  request: Request,
  { params }: { params: { fieldId: Number } }
): Promise<NextResponse<{ data: Field}>> {
  const props = await params;
  const fieldId = props.fieldId;

  const data: Field = await fetchFieldById(fieldId);

  return NextResponse.json<{ data: Field }>({
    data,
  });
}

async function fetchFieldById(fieldId: Number): Promise<Field> {
  try {
    const session = await auth();
    if (!session) redirect("/api/auth/signin");

    const accessToken = session.accessToken;

    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 401) {
      redirect("/auth/signin");
    }

    if (!response.ok) {
      throw new Error(`Error while fetching answers: ${response.status}`);
    }

    const data = await response.json();

    return data as Field;
  } catch (error) {
    throw error;
  }
}
