import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { z } from "zod";
import {
  APPWRITE_ENDPOINT,
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECT_ID,
  PROJECTS_ID,
  WORKSPACES_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { updateProfileSchema } from "../schemas";
import { createSessionClient } from "@/lib/appwrite";

const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

const profileApp = new Hono()
  .patch(
    "/",
    sessionMiddleware,
    zValidator("form", updateProfileSchema),
    async (c) => {

      const {
        name,
        theme,
        image,
        currentPassword,
        newPassword
      } = c.req.valid("form");

      const { account, storage } = await createSessionClient();
      const updates = [];
      const currentPrefs = await account.getPrefs();


      let imageUrl: string | null = null;

      if (image instanceof Blob) {
        const fileId = ID.unique();
        const ext = image.type.split("/")[1] || "png";
        const fileName = `${fileId}.${ext}`;

        await storage.createFile(
          IMAGES_BUCKET_ID,
          fileId,
          new File([image], fileName, { type: image.type })
        );

        imageUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      }
      if (theme) {
        updates.push(account.updatePrefs({
          ...currentPrefs,
          theme
        }));
      }

      if (imageUrl) {
        updates.push(account.updatePrefs({
          ...currentPrefs,
          imageUrl
        }));
      }

      if (name) {
        updates.push(account.updateName(name));
      }

      if (currentPassword && newPassword) {
        updates.push(
          account.updatePassword(newPassword, currentPassword)
        );
      }

      await Promise.all(updates);

      return c.json({
        success: true,
        data: {
          name,
          theme,
          imageUrl,
          newPassword,
        }
      });
    }
  );

export default profileApp;