export const runtime = 'nodejs';

import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";

import { Member, MemberRole } from "../types";
import { getMember } from "../utils";

const membersApp = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          const prefs = await users.getPrefs(member.userId); // Получаем prefs пользователя

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
            imageUrl: prefs?.imageUrl || null, // Добавляем imageUrl из prefs
          };
        })
      );

      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToUpdate = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    if (!memberToUpdate) return c.json({ error: "Member not found" }, 404);

    const actingMember = await getMember({
      databases,
      workspaceId: memberToUpdate.workspaceId,
      userId: user.$id,
    });

    if (!actingMember || actingMember.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized" }, 401);

    if (memberToUpdate.$id === actingMember.$id)
      return c.json({ error: "Cannot delete yourself" }, 400);

    const allMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", memberToUpdate.workspaceId),
    ]);

    if (allMembers.total === 1)
      return c.json({ error: "Cannot delete the last member" }, 400);

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({
      data: {
        $id: memberId,
      },
    });
  })
  .patch(
    "/:memberId",
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      if (!memberToUpdate) return c.json({ error: "Member not found" }, 404);

      const actingMember = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!actingMember || actingMember.role !== MemberRole.ADMIN)
        return c.json({ error: "Unauthorized" }, 401);

      if (memberToUpdate.$id === actingMember.$id)
        return c.json({ error: "Cannot delete yourself" }, 400);

      const allMembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      if (allMembers.total === 1)
        return c.json({ error: "Cannot downgrade the last member" }, 400);

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({
        data: {
          $id: memberId,
        },
      });
    }
  );

export default membersApp;
