import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./features/auth/queries";
import { getWorkspaces } from "./features/workspaces/queries";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Игнорируем статические файлы и API-роуты
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
  const publicRoutes: string[] = []; // Добавьте сюда публичные маршруты при необходимости

  // Обработка authRoutes
  if (authRoutes.includes(url.pathname)) {
    const searchParams = new URLSearchParams(url.search);
    const redirectUrl = searchParams.get("q") ?? "/";
    if (user) return NextResponse.redirect(new URL(redirectUrl, url.origin));
    return NextResponse.next();
  }

  // Публичные маршруты доступны без авторизации
  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
