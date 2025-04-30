// Помечаем компонент как "Client Component"
"use client";

import { useParams } from "next/navigation";

// Твой хук
export const useWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId as string;  // например, если тебе нужен workspaceId из URL
};
