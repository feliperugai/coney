import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
// import { auth } from "~/server/auth";

export async function middleware(request: NextRequest) {
//   const session = await auth();
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token && request.nextUrl.pathname !== "/api/auth/signin") {
    console.log("redirecting from " + request.nextUrl.pathname);
    const response = NextResponse.redirect(
      new URL("/api/auth/signin", request.url),
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     */
    "/((?!api|images|_next/static|_next/image|favicon.ico).*)",
  ],
};
