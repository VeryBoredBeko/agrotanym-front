"use server";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || session.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(
      new URL(`${process.env.AUTH_SIGNIN_PATH}`, `${process.env.NEXTAUTH_URL}`)
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  const result = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?q=${latitude}%2C${longitude}&days=7&key=${process.env.WEATHER_API_KEY}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!result.ok) {
    const errorText = await result.text();

    return NextResponse.json(
      { error: "Error while making GET-request to Weather API", details: errorText },
      { status: result.status }
    );
  }

  const data = await result.json();
  return NextResponse.json({ data: data }, { status: 200 });
}
