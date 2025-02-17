import React, { useState, useEffect } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import TodoListCard from "../components/ListCards/TodoListCard.tsx";
import InProgressCard from "../components/ListCards/InProgressCard.tsx";
import CompletedCard from "../components/ListCards/CompletedCard.tsx";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useUpdateTaskStatusMutation } from "../store/api/tasksApi.ts";
import Group from "../assets/images/Group.png";
import Group1 from "../assets/images/Group1.png";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  category: string;
  image?: string;
}

const TaskViewScreen = ({ filteredTasks }) => {
  const [orderedTasks, setOrderedTasks] = useState<Task[] | null>(null);
  const [updatedFilteredTasks, setUpdatedFilteredTasks] = useState<
    Task[] | null
  >(filteredTasks);
  const [sortedState, setSortedState] = useState<"asc" | "desc">("asc");
  const [isMobile, setIsMobile] = useState(false);

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  useEffect(() => {
    const sorted = [...filteredTasks].sort((a, b) => {
      return sortedState === "desc"
        ? new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    setOrderedTasks(sorted);
  }, [filteredTasks, sortedState]);

  useEffect(() => {
    setUpdatedFilteredTasks(orderedTasks);
  }, [filteredTasks, orderedTasks]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile if width < 768px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSort = () => {
    setSortedState((curr) => (curr === "asc" ? "desc" : "asc"));
  };

  const handleDragEnd = (event) => {
    if (isMobile) return; // Disable drag on mobile

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // Target board ID
    updateTaskStatus({ taskId, newStatus });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
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
        <>
          {/* Table Container */}
          {!isMobile && (
            <div className="bg-white shadow-lg w-full text-center overflow-x-auto border border-gray-200 rounded-md">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-sm font-semibold text-gray-600 p-4 text-center border-b border-gray-300">
                      Task name
                    </th>
                    <th className="text-sm font-semibold text-gray-600 p-4 text-center border-b border-gray-300 flex items-center justify-center">
                      <span className="mr-2">Due on</span>
                      <button
                        className="ml-1 p-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={handleSort}
                      >
                        <ArrowUpward fontSize="small" />
                      </button>
                      <button
                        className="ml-1 p-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={handleSort}
                      >
                        <ArrowDownward fontSize="small" />
                      </button>
                    </th>
                    <th className="text-sm font-semibold text-gray-600 p-4 text-center border-b border-gray-300">
                      Task Status
                    </th>
                    <th className="text-sm font-semibold text-gray-600 p-4 text-center border-b border-gray-300">
                      Task Category
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          )}

          {/* Drag & Drop Section */}
          {isMobile ? (
            <div className="flex flex-col gap-4 w-full max-w-6xl">
              <TodoListCard
                id="todo"
                tasks={updatedFilteredTasks?.filter(
                  (task) => task.status === "todo"
                )}
              />
              <InProgressCard
                id="in-progress"
                tasks={updatedFilteredTasks?.filter(
                  (task) => task.status === "in-progress"
                )}
              />
              <CompletedCard
                id="completed"
                tasks={updatedFilteredTasks?.filter(
                  (task) => task.status === "completed"
                )}
              />
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col gap-4 w-full">
                <TodoListCard
                  id="todo"
                  tasks={updatedFilteredTasks?.filter(
                    (task) => task.status === "todo"
                  )}
                />
                <InProgressCard
                  id="in-progress"
                  tasks={updatedFilteredTasks?.filter(
                    (task) => task.status === "in-progress"
                  )}
                />
                <CompletedCard
                  id="completed"
                  tasks={updatedFilteredTasks?.filter(
                    (task) => task.status === "completed"
                  )}
                />
              </div>
            </DndContext>
          )}
        </>
      )}
    </div>
  );
};

export default TaskViewScreen;
