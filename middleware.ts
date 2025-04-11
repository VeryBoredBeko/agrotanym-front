import { auth } from "@/auth";
import { NextResponse } from "next/server";

// securing page from unauthenticated user
export default auth((req) => {

  // if user is not authenticated
  // would be redirected to login page
  if (!req.auth) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  // defines URL-paths which would be intercepted
  matcher: ["/forum/posts/create", "/image-classifier", "/farm/fields"],
};
