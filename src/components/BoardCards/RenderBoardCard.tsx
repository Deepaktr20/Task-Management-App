import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import { useDraggable } from "@dnd-kit/core";
import { useDeleteTaskMutation } from "../../store/api/tasksApi.ts";
import TaskUpdateModal from "../TaskUpdateModal.tsx";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  category: string;
  image?: string;
}

// @ts-ignore

const RenderBoardCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
  });
  const [open, setOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(
    null
  );

  const [deleteTask] = useDeleteTaskMutation();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleDotsPress = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleContentEdit = (task: Task) => {
    setOpen(true);
    setSelectedTaskForEdit(task);
    setMenuAnchor(null);
  };
  const handleContentDelete = async (taskId) => {
    await deleteTask(taskId);
    handleCloseMenu();
  };

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : "none",
    position: "relative",
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="shadow-md border-l-4 border-blue-500 mb-3 p-4"
      >
        <IconButton
          className="text-gray-600 hover:bg-gray-100 rounded-full"
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
          }}
          onClick={handleDotsPress}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MenuItem
            onClick={() => handleContentEdit(task)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Edit fontSize="small" className="mr-2" /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => handleContentDelete(task.id)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Delete fontSize="small" className="mr-2" /> Delete
          </MenuItem>
        </Menu>
        <CardContent>
          <Typography
            variant="h6"
            className={`font-semibold ${
              task.status === "Completed" ? "line-through" : ""
            }`}
          >
            {task.title}
          </Typography>
          <div className="flex justify-between items-end mt-4">
            <Typography variant="body2" className="text-gray-600">
              {task.category}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {task.date === "Today"
                ? "Today"
                : new Date(task.date).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <TaskUpdateModal
        open={open}
        onClose={() => setOpen(false)}
        task={selectedTaskForEdit}
      />
    </>
  );
};

export default RenderBoardCard;
