import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const secret = request.nextUrl.searchParams.get("secret");

    if (!userId || !secret) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    const response = NextResponse.redirect(`${request.nextUrl.origin}/sign-in`);
    response.cookies.set(AUTH_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in?error=auth_failed`);
  }
}