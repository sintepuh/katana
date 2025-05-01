import authApp from "@/features/auth/server/route";
import membersApp from "@/features/members/server/route";
import projectApp from "@/features/projects/server/route";
import taskApp from "@/features/tasks/server/route";
import profileApp from "@/features/profile/server/route";
import workspacesApp from "@/features/workspaces/server/route";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono()
  .basePath("/api")
  .route("/profile", profileApp)
  .route("/auth", authApp)
  .route("/workspaces", workspacesApp)
  .route("/members", membersApp)
  .route("/projects", projectApp)
  .route("/tasks", taskApp);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
