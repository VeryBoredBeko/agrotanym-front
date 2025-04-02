import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/forum/posts/create", "/image-classifier"],
};
