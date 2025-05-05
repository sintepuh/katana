export const runtime = 'nodejs';

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import {
  APPWRITE_ENDPOINT,
  IMAGES_BUCKET_ID,
  PROJECT_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { updateProfileSchema, updateThemeSchema } from "../schemas";
import { createSessionClient } from "@/lib/appwrite";

const profileApp = new Hono()
  .patch(
    "/update-theme",
    sessionMiddleware,
    zValidator("form", updateThemeSchema),
    async (c) => {

      const {
        theme,
      } = c.req.valid("form");

      const { account } = await createSessionClient();
      const currentPrefs = await account.getPrefs();

      if (theme) {
        account.updatePrefs({
          ...currentPrefs,
          theme
        });
      }

      return c.json({
        success: true,
        data: {
          ...currentPrefs,
          theme,
        }
      });
    }
  )
  .patch(
    "/",
    sessionMiddleware,
    zValidator("form", updateProfileSchema),
    async (c) => {

      const {
        name,
        image,
        currentPassword,
        newPassword
      } = c.req.valid("form");

      const { account, storage } = await createSessionClient();
      const prefs = await account.getPrefs();
      const currentPrefs = prefs ?? {};



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

      let updatedName = null;
      let updatedImageUrl = null;
      let updatedPassword = false;

      if (name) {
        await account.updateName(name);
        updatedName = name;
      }

      if (imageUrl) {
        await account.updatePrefs({
          ...currentPrefs,
          imageUrl,
        });
        updatedImageUrl = imageUrl;
      }

      if (currentPassword && newPassword) {
        await account.updatePassword(newPassword, currentPassword);
        updatedPassword = true;
      }

      return c.json({
        success: true,
        data: {
          name: updatedName,
          imageUrl: updatedImageUrl,
          passwordUpdated: updatedPassword,
        },
      });
    }
  );

export default profileApp;