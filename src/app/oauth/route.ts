export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    const inviteCookie = request.cookies.get('postAuthRedirect')?.value;

    const redirectUrl = inviteCookie
      ? new URL(inviteCookie, request.url)
      : new URL('/sign-in', request.url);

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(AUTH_COOKIE_NAME, session.secret, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    if (inviteCookie) {
      response.cookies.delete('postAuthRedirect');
    }
    
    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in?error=auth_failed`);
  }
}