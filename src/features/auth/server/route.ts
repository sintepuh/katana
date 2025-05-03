export const runtime = 'nodejs';

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID } from "node-appwrite";

import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const authApp = new Hono()
  .get("/current", sessionMiddleware, (c) => c.json({ user: c.get("user") }))
  // .get("/current", sessionMiddleware, async (c) => {
  //   const user = c.get("user");

  //   const { account } = await createSessionClient();

  //   const session = await account.getSession("current");
  //   const prefs = await account.getPrefs();

  //   console.log("Session:", session);
  //   console.log("Prefs:", prefs);

  //   const providerАvatarUrl = `https://avatars.githubusercontent.com/u/${session.providerUid}`

  //   const currPrefs = await account.updatePrefs({
  //     ...prefs,
  //     providerАvatarUrl
  //   })

  //   user.prefs = currPrefs


  //   return c.json({
  //     user
  //   });
  // })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return c.json({ success: true, error: null });
    } catch (error) {
      throw new Error((error as Error)?.message ?? "An error occurred");
    }
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return c.json({
        success: true,
        error: null,
      });
    } catch (e) {
      return c.json({
        error: (e as Error)?.message ?? "An error occurred",
        success: false,
      });
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE_NAME);

    await account.deleteSession("current");
    return c.json({ success: true });
  });

export default authApp;