export const runtime = 'nodejs';

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { z } from "zod";
import { createTaskSchema, getTasksSchema } from "../schema";
import { Task, TaskStatus } from "../types";

const taskApp = new Hono();

export default taskApp
  .get("/:taskId", sessionMiddleware, async (c) => {
    const { users } = await createAdminClient();
    const databases = c.get("databases");
    const currentUser = c.get("user");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMember({
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
      databases,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const [user, userPrefs] = await Promise.all([
      users.get(member.userId),
      users.getPrefs(member.userId)
    ]);

    const assignee = {
      ...member,
      name: user.name || user.email,
      email: user.email,
      imageUrl: userPrefs?.imageUrl || null
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .get(
    "/",
    zValidator("query", getTasksSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { users } = await createAdminClient();

      const { workspaceId, projectId, status, assigneeId, search, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        workspaceId,
        userId: user.$id,
        databases,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) query.push(Query.equal("projectId", projectId));
      if (status) query.push(Query.equal("status", status));
      if (assigneeId) query.push(Query.equal("assigneeId", assigneeId));
      if (search) query.push(Query.search("name", search));
      if (dueDate) query.push(Query.lessThanEqual("dueDate", dueDate));

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = Array.from(
        new Set(tasks.documents.map((task) => task.projectId))
      );

      const assigneeIds = Array.from(
        new Set(tasks.documents.map((task) => task.assigneeId))
      );

      let projects: Models.DocumentList<Project> = {
        documents: [],
        total: 0,
      };

      if (projectIds.length > 0)
        projects = await databases.listDocuments<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          [Query.contains("$id", projectIds)]
        );

      let members: Models.DocumentList<Project> = {
        documents: [],
        total: 0,
      };

      if (assigneeIds.length > 0)
        members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("$id", assigneeIds),
        ]);

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const [user, userPrefs] = await Promise.all([
            users.get(member.userId),
            users.getPrefs(member.userId)
          ]);

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
            imageUrl: userPrefs?.imageUrl || null
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          ({ $id }) => $id === task.projectId
        );

        const assignee = assignees.find(({ $id }) => $id === task.assigneeId);

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    zValidator("json", createTaskSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const {
        name,
        status,
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid("json");

      const members = await getMember({
        workspaceId,
        userId: user.$id,
        databases,
      });

      if (!members) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPriorityTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("projectId", projectId),
          Query.equal("status", status),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPriorityTasks.total > 0
          ? highestPriorityTasks.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          description,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const member = await getMember({
      workspaceId: task.workspaceId,
      userId: user.$id,
      databases,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: taskId } });
  })
  .patch(
    "/:taskId",
    zValidator("json", createTaskSchema.partial()),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { name, status, projectId, assigneeId, dueDate, description } =
        c.req.valid("json");

      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const members = await getMember({
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
        databases,
      });

      if (!members) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          assigneeId,
          dueDate,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .post(
    "/bulk-update",
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map(({ $id }) => $id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );
      if (workspaceIds.size != 1)
        return c.json({ error: "All task must be from same workspace" }, 401);

      const workspaceId = workspaceIds.values().next().value;
      if (!workspaceId) return c.json({ error: "Workspace not found" }, 404);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const updatedTask = await Promise.all(
        tasks.map(async (task) => {
          const { $id, position, status } = task;
          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTask });
    }
  );
