import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createSessionClient } from "@/lib/appwrite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const themeSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
});

const themeApp = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    try {
      const { account } = await createSessionClient();
      const prefs = await account.getPrefs();

      const theme = prefs?.theme ?? "light";

      return c.json({ theme });
    } catch (error) {
      console.error("Error getting theme preferences:", error);
      return c.json({ error: "An error occurred while retrieving theme preferences" }, 500);
    }
  })
  .post("/", sessionMiddleware, zValidator("json", themeSchema), async (c) => {
    try {
      const { theme } = c.req.valid("json");

      const { account } = await createSessionClient();

      await account.updatePrefs({ theme });

      return c.json({ success: true, theme });
    } catch (error) {
      console.error("Error updating theme preference:", error);
      return c.json({ error: "An error occurred while updating theme preference" }, 500);
    }
  });

export default themeApp;