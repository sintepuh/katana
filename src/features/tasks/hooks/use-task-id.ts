import { useParams } from "next/navigation";

export const useTaskId = () => useParams().taskId as string;
