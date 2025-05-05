/* eslint-disable @typescript-eslint/no-explicit-any */

import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { APPWRITE_ENDPOINT, DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, PROJECT_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createProjectSchema, updateProjectSchema } from "../schema";
import { Project } from "../types";
import { Task, TaskStatus } from "@/features/tasks/types";
import { createAdminClient } from "@/lib/appwrite";

const formatTaskStatus = (status: TaskStatus) => {
  return status
    .replace("_", " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const projectApp = new Hono()
  .get("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({
      data: project,
    });
  })
  .get(
    "/",
    zValidator("query", z.object({ workspaceId: z.string() })),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Workspace ID is required" }, 400);
      }

      const members = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!members) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({
        data: projects,
      });
    }
  )
  .post(
    "/",
    zValidator("form", createProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );
      return c.json({
        data: project,
      });
    }
  )
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { image, name } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
      });

      if (!member) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

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

      const updateData: { name: string | undefined; imageUrl?: string } = {
        name: name,
      };

      if (uploadedImageUrl) {
        updateData.imageUrl = uploadedImageUrl;
      }


      const workspace = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        updateData
      );

      return c.json({
        data: workspace,
      });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!existingProject) throw new Error("Project not found");

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: existingProject.workspaceId,
    });

    if (!member) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({
      success: true,
      data: {
        $id: projectId,
      },
    });
  })
  .get("/:projectId/analytic", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();

    const queryTasks = async (filters: any[]): Promise<any> => {
      return databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal("projectId", projectId),
        ...filters,
      ]);
    };

    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const next6Months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1);
      return {
        label: `${months[date.getMonth()]}`,
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      };
    });

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

    const countDiff = (a: any, b: any): number => a.total - b.total;

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



    const allTasks = await queryTasks([
      Query.greaterThanEqual("dueDate", next6Months[0].start.toISOString()),
      Query.lessThanEqual("dueDate", next6Months[4].end.toISOString()),
    ]);

    const taskStatusCounts = Object.values(TaskStatus).map((status) => ({
      status: formatTaskStatus(status),
      count: allTasks.documents.filter((t: Task) => t.status === status).length as number,
    }));

    const taskStatistics = next6Months.map(({ label, start, end }) => {
      const count = allTasks.documents.filter((task: Task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= start && dueDate <= end;
      }).length;
      return { month: label, taskCount: count };
    });

    const users = await createAdminClient().then(client => client.users);

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

    const memberTaskArray = Object.values(memberTaskCounts);

    return c.json({
      data: {
        analytic,
        taskStatistics,
        taskStatusCounts,
        memberTaskArray,
      },
    });
  });
export default projectApp;
