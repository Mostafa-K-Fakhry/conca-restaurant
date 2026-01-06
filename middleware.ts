import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // لو الصفحة أدمن واليوزر مش أدمن، حوله للصفحة الرئيسية
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // لازم يكون مسجل دخول
    },
  }
);

// تحديد المسارات المحمية
export const config = {
  matcher: ["/admin/:path*"],
};