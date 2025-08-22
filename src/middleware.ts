import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  if (nextUrl.pathname.startsWith("/dashboard")) {
    const role = req.auth?.user?.role ?? "user";
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
