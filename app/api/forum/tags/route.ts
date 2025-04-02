"use server";

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { Tag } from "@/interfaces/tag";

export async function GET(
  request: Request
): Promise<NextResponse<{ tags: Tag[] }>> {
  const tags: Tag[] = await fetchTags();

  return NextResponse.json<{ tags: Tag[] }>({
    tags,
  });
}

async function fetchTags(): Promise<Tag[]> {
  try {
    const session = await auth();

    if (!session || session.error) {
      redirect(`${process.env.AUTH_SIGNIN_PATH}`);
    }

    const accessToken = session.accessToken;

    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/tags`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 401) {
      redirect(`${process.env.AUTH_SIGNIN_PATH}`);
    }

    if (!response.ok) {
      throw new Error(`Error while fetching answers: ${response.status}`);
    }

    const data = await response.json();

    return data as Tag[];
  } catch (error) {
    return [];
  }
}
