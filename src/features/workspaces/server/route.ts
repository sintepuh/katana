/* eslint-disable @typescript-eslint/no-explicit-any */
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import {
  APPWRITE_ENDPOINT,
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  PROJECT_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";
import { Task, TaskStatus } from "@/features/tasks/types";
import { createAdminClient } from "@/lib/appwrite";

const formatTaskStatus = (status: TaskStatus) => {
  return status
    .replace("_", " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};


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

      let uploadedImageUrl: string | null = null;

      if (image instanceof Blob) {
        const fileId = ID.unique();
        const ext = image.type.split("/")[1] || "png";
        const fileName = `${fileId}.${ext}`;

        await storage.createFile(
          IMAGES_BUCKET_ID,
          fileId,
          new File([image], fileName, { type: image.type })
        );

        uploadedImageUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
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

      let uploadedImageUrl = null;

      if (image instanceof Blob) {
        const fileId = ID.unique();
        const ext = image.type.split("/")[1] || "png";
        const fileName = `${fileId}.${ext}`;

        await storage.createFile(
          IMAGES_BUCKET_ID,
          fileId,
          new File([image], fileName, { type: image.type })
        );

        uploadedImageUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      }

      const updateData: { name?: string; imageUrl?: string } = {
        name,
      };

      if (uploadedImageUrl) {
        updateData.imageUrl = uploadedImageUrl;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        updateData
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
    const { users } = await createAdminClient();
    const { workspaceId } = c.req.param();

    // Проверка прав участника
    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return c.json({ error: "Unauthorized" }, 401);

    const now = new Date();



    // Подготовка меток месяцев, включая текущий, два предыдущих и два следующих
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const next6Months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1); // текущий месяц и два предыдущих, два следующих
      return {
        label: `${months[date.getMonth()]}`,
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59), // последний день месяца
      };
    });

    // Типизированная функция для выборки задач с фильтрами
    const queryTasks = async (filters: any[]): Promise<any> => {
      return databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal("workspaceId", workspaceId),
        ...filters,
      ]);
    };

    // Получение задач по различным условиям (текущий и прошлый месяц)
    const taskCounts = await Promise.all([
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[2].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[2].end.toISOString())]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[1].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[1].end.toISOString())]),
      queryTasks([
        Query.greaterThanEqual("$createdAt", next6Months[2].start.toISOString()),
        Query.lessThanEqual("$createdAt", next6Months[2].end.toISOString()),
        Query.notEqual("status", TaskStatus.BACKLOG),
        Query.notEqual("status", TaskStatus.DONE),
      ]),
      queryTasks([
        Query.greaterThanEqual("$createdAt", next6Months[1].start.toISOString()),
        Query.lessThanEqual("$createdAt", next6Months[1].end.toISOString()),
        Query.notEqual("status", TaskStatus.BACKLOG),
        Query.notEqual("status", TaskStatus.DONE),
      ]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[2].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[2].end.toISOString()), Query.notEqual("status", TaskStatus.DONE)]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[1].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[1].end.toISOString()), Query.notEqual("status", TaskStatus.DONE)]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[2].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[2].end.toISOString()), Query.equal("status", TaskStatus.DONE)]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[1].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[1].end.toISOString()), Query.equal("status", TaskStatus.DONE)]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[2].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[2].end.toISOString()), Query.lessThan("dueDate", now.toISOString()), Query.notEqual("status", TaskStatus.DONE)]),
      queryTasks([Query.greaterThanEqual("$createdAt", next6Months[1].start.toISOString()), Query.lessThanEqual("$createdAt", next6Months[1].end.toISOString()), Query.lessThan("dueDate", now.toISOString()), Query.notEqual("status", TaskStatus.DONE)]),
    ]);

    const [
      thisMonthTasks,
      lastMonthTasks,
      thisMonthAssignedTasks,
      lastMonthAssignedTasks,
      thisMonthInCompletedTasks,
      lastMonthInCompletedTasks,
      thisMonthCompletedTasks,
      lastMonthCompletedTasks,
      thisMonthOverDueTasks,
      lastMonthOverDueTasks,
    ] = taskCounts;

    // Функция подсчета разницы между двумя выборками задач
    const countDiff = (a: any, b: any): number => a.total - b.total;

    // Общая аналитика по задачам
    const analytic = {
      taskCount: thisMonthTasks.total as number,
      taskDiff: countDiff(thisMonthTasks, lastMonthTasks),
      assignedTaskCount: thisMonthAssignedTasks.total as number,
      assignedTaskDiff: countDiff(thisMonthAssignedTasks, lastMonthAssignedTasks),
      inCompletedTaskCount: thisMonthInCompletedTasks.total as number,
      inCompletedTaskDiff: countDiff(thisMonthInCompletedTasks, lastMonthInCompletedTasks),
      completedTaskCount: thisMonthCompletedTasks.total as number,
      completedTaskDiff: countDiff(thisMonthCompletedTasks, lastMonthCompletedTasks),
      overDueTaskCount: thisMonthOverDueTasks.total as number,
      overDueTaskDiff: countDiff(thisMonthOverDueTasks, lastMonthOverDueTasks),
    };


    // Получаем все задачи за 5 месяцев (текущий, два предыдущих и два следующих)
    const allTasks: Task = await queryTasks([
      Query.greaterThanEqual("dueDate", next6Months[0].start.toISOString()),
      Query.lessThanEqual("dueDate", next6Months[4].end.toISOString()),
    ]);

    // Подсчет задач по статусу
    const taskStatusCounts = Object.values(TaskStatus).map((status) => ({
      status: formatTaskStatus(status),
      count: allTasks.documents.filter((t: Task) => t.status === status).length as number,
    }));

    // Статистика задач по месяцам
    const taskStatistics = next6Months.map(({ label, start, end }) => {
      const count = allTasks.documents.filter((task: Task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= start && dueDate <= end;
      }).length as number;
      return { month: label, taskCount: count };
    });

    // Подсчет задач по каждому участнику с получением имени
    const memberTaskCounts: Record<string, { memberName: string; taskCount: number }> = {};

    for (const task of allTasks.documents) {
      if (!task.assigneeId || task.status == TaskStatus.BACKLOG || task.status == TaskStatus.DONE) continue;

      if (!memberTaskCounts[task.assigneeId]) {
        const member = await databases.getDocument(DATABASE_ID, MEMBERS_ID, task.assigneeId);
        const profile = await users.get(member.userId);
        memberTaskCounts[task.assigneeId] = { memberName: profile.name, taskCount: 1 };
      } else {
        memberTaskCounts[task.assigneeId].taskCount++;
      }
    }

    // Преобразуем в массив для фронтенда
    const memberTaskArray = Object.values(memberTaskCounts);

    // Финальный ответ с аналитикой
    return c.json({
      data: {
        analytic,
        taskStatistics,
        taskStatusCounts,
        memberTaskArray,
      },
    });
  })
export default workspaceApp;
