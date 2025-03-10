import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./features/auth/queries";
import { getWorkspaces } from "./features/workspaces/queries";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const ignoreResourcesExt = ["ico", "css", "js", "svg", "png"];
  if (
    url.href.includes("static") ||
    ignoreResourcesExt.some((ext) => url.href.includes(ext)) ||
    url.pathname.includes("api")
  ) {
    return NextResponse.next();
  }

  const user = await getCurrentUser();

  const authRoutes = ["/sign-in", "/sign-up"];
  if (authRoutes.includes(url.pathname)) {
    const searchParams = new URLSearchParams(url.search);
    const redirectUrl = searchParams.get("q") ?? "/";

    if (user) return NextResponse.redirect(new URL(redirectUrl, url.origin));

    return NextResponse.next();
  }
  
  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    return NextResponse.redirect(new URL("/workspaces/create", url.origin));
  } else if (url.pathname === "/") {
    return NextResponse.redirect(new URL(`/workspaces/${workspaces.documents[0].$id}`, url.origin));
  }

  const publicRoute: string[] = [];

  if (publicRoute.includes(url.pathname)) {
    return NextResponse.next();
  }

  if (!user) {
    const currentUrl = encodeURI(url.pathname);
    return NextResponse.redirect(
      new URL(`/sign-in?q=${currentUrl}`, url.origin)
    );
  }



  return NextResponse.next();
}
