import React from "react";
import ToDoBoard from "../components/BoardCards/ToDoBoard.tsx";
import InProgressBoard from "../components/BoardCards/InProgressBoard.tsx";
import CompletedBoard from "../components/BoardCards/CompletedBoard.tsx";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { useUpdateTaskStatusMutation } from "../store/api/tasksApi.ts";
import Group from "../assets/images/Group.png";
import Group1 from "../assets/images/Group1.png";

const BoardViewScreen = ({ filteredTasks }) => {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;
    updateTaskStatus({ taskId, newStatus });
  };

  return (
    <>
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center relative">
          <img
            src={Group}
            alt="No Tasks Found"
            className="w-48 h-48 relative"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <img src={Group1} alt="Inside Group" className="w-20 h-20" />
          </div>

          <p className="text-gray-600 mt-4">
            No tasks available. Try adding a new task!
          </p>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-gray-200 min-h-screen flex flex-col md:flex-row justify-between items-start gap-6 p-6">
            {" "}
            <ToDoBoard
              id="todo"
              tasks={filteredTasks.filter((task) => task.status === "todo")}
            />
            <InProgressBoard
              id="in-progress"
              tasks={filteredTasks.filter(
                (task) => task.status === "in-progress"
              )}
            />
            <CompletedBoard
              id="completed"
              tasks={filteredTasks.filter(
                (task) => task.status === "completed"
              )}
            />
          </div>
        </DndContext>
      )}
    </>
  );
};

export default BoardViewScreen;
