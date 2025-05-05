import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ['/', '/sign-in', '/sign-up'];
const privateRoutes = ['/dashboard'];

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('katana-auth-token')?.value;
  

  // Если пользователь на публичной странице и уже авторизован, перенаправляем его в рабочую область
  if (publicRoutes.includes(pathname)) {
    if (token) {
      return redirectToFirstWorkspace(request);
    }

    return NextResponse.next();
  }

  // Если на приватной странице, а токена нет, перенаправляем на login
  if (privateRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      if (pathname.includes('/join/')) {
        const inviteUrl = request.nextUrl.pathname;
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.set('postAuthRedirect', inviteUrl, {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 5, // 5 минут
        });
        return response;
      }

      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}


export async function redirectToFirstWorkspace(request: NextRequest) {
  try {
    const { getWorkspaces } = await import('@/lib/workspace-server');
    const workspaces = await getWorkspaces();

    if (workspaces.total === 0) {
      return NextResponse.redirect(new URL('/dashboard/workspaces/create', request.url));
    }
    return NextResponse.redirect(
      new URL(`/dashboard/workspaces/${workspaces.documents[0].$id}`, request.url)
    );
  } catch (error) {
    console.error('Workspaces fetch error:', error);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
