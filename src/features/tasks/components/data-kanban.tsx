import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";

import { Task, TaskStatus } from "../types";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

export type DataKanbanProps = {
  data: Task[];
  onChange: (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => void;
};

const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTask: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTask[task.status].push(task);
    });

    Object.keys(initialTask).forEach((status) => {
      initialTask[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return initialTask;
  });

  useEffect(() => {
    const newTask: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      newTask[task.status].push(task);
    });

    Object.keys(newTask).forEach((status) => {
      newTask[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTask);
  }, [data])

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      setIsDragging(false);
      return;
    }

    const { source, destination } = result;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    let updatesPayload: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[] = [];

    setTasks((prev) => {
      const newTasks = { ...prev };

      const sourceCol = [...newTasks[sourceStatus]];
      const [movedTask] = sourceCol.splice(source.index, 1);

      if (!movedTask) {
        console.log("Task not found");
        return prev;
      }

      const updatedMovedTask =
        sourceStatus !== destinationStatus
          ? { ...movedTask, status: destinationStatus }
          : movedTask;

      newTasks[sourceStatus] = sourceCol;
      const destinationCol = [...newTasks[destinationStatus]];
      destinationCol.splice(destination.index, 0, updatedMovedTask);
      newTasks[destinationStatus] = destinationCol;

      updatesPayload = [];

      updatesPayload.push({
        $id: updatedMovedTask.$id,
        status: updatedMovedTask.status,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position != newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: task.status,
              position: newPosition,
            });
          }
        }
      });

      if (sourceStatus != destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position != newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: task.status,
                position: newPosition,
              });
            }
          }
        });
      }
      return newTasks;
    });
    onChange(updatesPayload);
    setIsDragging(false); 
  }, [onChange]);

  return (
    <div
      id="scroll-container"
      style={{ maxWidth: "100%", scrollBehavior: "smooth" }}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div
          className={`transition-all flex gap-2 overflow-x-auto ${isDragging
            ? ""
            : "snap-x snap-mandatory sm:snap-none"
            }`}
        >
          {boards.map((board) => {
            return (
              <div
                key={board}
                className="flex-1 bg-accent p-1.5 rounded-md min-w-[calc(100vw-33px)] min-[425px]:min-w-[calc(50vw-20.6px)] sm:min-w-[200px] h-max snap-start"
              >
                <KanbanColumnHeader
                  board={board}
                  taskCount={tasks[board].length}
                />
                <Droppable
                  droppableId={board}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="py-1.5 flex flex-col gap-2"
                    >
                      {tasks[board].map((task, index) => (
                        <Draggable
                          key={task.$id}
                          draggableId={task.$id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <KanbanCard task={task} isDragging={snapshot.isDragging} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DataKanban;
