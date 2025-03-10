import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const workspaceApp = new Hono()
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({
      data: workspace,
    });
  })
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(
      DATABASE_ID, 
      MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.documents.length === 0) {
      return c.json({
        success: true,
        data: {
          documents: [],
        },
      });
    }

    const workspaceId = members.documents.map((member) => member.workspaceId);

    const workspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceId)]
    );

    return c.json({
      success: true,
      data: workspace,
    });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof Blob) {
        const fileId = ID.unique();
        const extStr = image.type.split("/")[1];

        const uploadFile = new File(
          [image],
          `${fileId}.${extStr.indexOf("svg") != -1 ? "svg" : extStr}`,
          { type: image.type }
        );

        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          fileId,
          uploadFile
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:${file.mimeType};base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({
        success: true,
        data: workspace,
      });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { image, name } = c.req.valid("form");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            error: "Unauthorized",
          },
          401
        );
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof Blob) {
        const fileId = ID.unique();
        const extStr = image.type.split("/")[1];

        const uploadFile = new File(
          [image],
          `${fileId}.${extStr.indexOf("svg") != -1 ? "svg" : extStr}`,
          { type: image.type }
        );

        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          fileId,
          uploadFile
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:${file.mimeType};base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl ?? null,
        }
      );

      return c.json({
        success: true,
        data: workspace,
      });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    // TODO: Delete Members, projects & tasks

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({
      success: true,
      data: {
        $id: workspaceId,
      },
    });
  })
  .post("/:workspaceId/reset-invite", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    );

    return c.json({
      success: true,
      data: workspace,
    });
  })
  .post(
    "/:workspaceId/join",
    zValidator(
      "json",
      z.object({
        code: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const { workspaceId } = c.req.param();

      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (member) {
        return c.json(
          {
            error: "Already a member",
          },
          400
        );
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId/analytic", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId: workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );
    const taskCount = thisMonthTasks.total;
    const taskDiff = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.equal("assigneeId", user.$id),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.equal("assigneeId", user.$id),
      ]
    );
    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthInCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
      ]
    );
    const lastMonthInCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
      ]
    );
    const inCompletedTaskCount = thisMonthInCompletedTasks.total;
    const inCompletedTaskDiff =
      inCompletedTaskCount - lastMonthInCompletedTasks.total;

    const thisMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.equal("status", TaskStatus.DONE),
      ]
    );
    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.equal("status", TaskStatus.DONE),
      ]
    );
    const completedTaskCount = thisMonthCompletedTask.total;
    const completedTaskDiff = completedTaskCount - lastMonthCompletedTask.total;

    const thisMonthOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.lessThan("dueDate", new Date().toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
      ]
    );
    const lastMonthOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.lessThan("dueDate", new Date().toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
      ]
    );
    const overDueTaskCount = thisMonthOverDueTasks.total;
    const overDueTaskDiff = overDueTaskCount - lastMonthOverDueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDiff,
        assignedTaskCount,
        assignedTaskDiff,
        inCompletedTaskCount,
        inCompletedTaskDiff,
        completedTaskCount,
        completedTaskDiff,
        overDueTaskCount,
        overDueTaskDiff,
      },
    });
  });

export default workspaceApp;
