import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskUpdateModal from "../TaskUpdateModal.tsx";
import DraggableTask from "./DraggableTask.tsx";
import { useDroppable } from "@dnd-kit/core";
import { useDeleteTaskMutation } from "../../store/api/tasksApi.ts";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "Work" | "Personal";
  image?: string;
}
interface CompletedCardProps {
  id: string;
  tasks: Task[];
}

const CompletedCard: React.FC<CompletedCardProps> = ({ id, tasks }) => {
  const { setNodeRef } = useDroppable({ id });
  const [tasksList, setTasksList] = useState<Task[]>(tasks);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(
    null
  );
  const [deleteTask] = useDeleteTaskMutation();

  useEffect(() => {
    setTasksList(tasks);
  }, [tasks]);


  const handleDeleteTask = async(taskId: string) => {
    await deleteTask(taskId);
    setMenuAnchor(null);
  };

  const handleEditClick = (task: Task) => {
    setOpen(true);
    setSelectedTaskForEdit(task);
    setMenuAnchor(null);
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleDeleteSelectedTasks = () => {
    const updatedTasks = tasksList.filter(
      (task) => !selectedTasks.includes(task.id)
    );
    setTasksList(updatedTasks); // Update state
    setSelectedTasks([]); // Clear selected tasks
  };

  return (
    <Box className="w-full p-4 bg-white shadow-md rounded-lg">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ backgroundColor: "#CEFFCC", padding: 1, borderRadius: 1 }}
          >
            Completed ({tasksList?.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {selectedTasks?.length > 0 && (
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleDeleteSelectedTasks}
            >
              DELETE SELECTED ({selectedTasks?.length})
            </Button>
          )}
          <TableContainer component={Paper}>
            <Table>
              <TableBody ref={setNodeRef}>
                {tasksList?.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">
                    No tasks found in completed.
                  </p>
                ) : (
                  tasksList?.map((task) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      tasksList={tasksList}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteTask}
                      selectedTasks={selectedTasks}
                      toggleTaskSelection={toggleTaskSelection}
                      setTasksList={setTasksList}
                      menuAnchor={menuAnchor}
                      setMenuAnchor={setMenuAnchor}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <TaskUpdateModal
        open={open}
        onClose={() => setOpen(false)}
        task={selectedTaskForEdit}
      />
    </Box>
  );
};

export default CompletedCard;
