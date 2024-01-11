import { request } from "http";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // Getting the users next-auth token
    const isAuth = await getToken({ req });

    // Building a list of paths to check
    const pathname = req.nextUrl.pathname;
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // Going to the 'login' page?
    if (isLoginPage) {
      // If you are already logged in go to the dashboard page.
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // If you are not logged in, continue with your request to the login page.
      return NextResponse.next();
    }

    // Going to a sensitive route without being logged in?
    if (!isAuth && isAccessingSensitiveRoute) {
      // Redirect to the login page
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Going to the home page?
    if (pathname === "/") {
      // Redirect you to the dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    // Workaround to prevent middlware redirection looping by authorizing it with next-auth
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

// Paths that will invoke the middleware checks
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
