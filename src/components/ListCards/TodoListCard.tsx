import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskUpdateModal from "../TaskUpdateModal.tsx";
import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask.tsx";
import { useAddTaskMutation,useDeleteTaskMutation } from "../../store/api/tasksApi.ts";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  category: string;
  image?: string;
}
interface TodoListProps {
  id: string;
  tasks: Task[];
}

const TodoListCard: React.FC<TodoListProps> = ({ id, tasks }) => {
  const { setNodeRef } = useDroppable({ id });
  const [tasksList, setTasksList] = useState<Task[]>(tasks);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("work");
  const [status, setStatus] = useState("todo");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(
    null
  );
  const [addTask]=useAddTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  useEffect(() => {
    setTasksList(tasks);
  }, [tasks]);

  const handleAddTask = async() => {
    const task={ title,date,category,status,};
    await addTask(task);
    setTitle("");
    setCategory("work");
    setDate("");
    setStatus("todo");
  };

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
    setTasksList(updatedTasks); 
    setSelectedTasks([]); 
  };
  
  return (
    <Box className="w-full p-4 bg-white shadow-md rounded-lg">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{ backgroundColor: "#F5A9E1", padding: 1, borderRadius: 1 }}
          >
            Todo ({tasksList?.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Button startIcon={<AddIcon />} onClick={() => setIsAdding(true)}>
              ADD TASK
            </Button>
            {selectedTasks?.length > 0 && (
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleDeleteSelectedTasks}
              >
                DELETE SELECTED ({selectedTasks?.length})
              </Button>
            )}
          </Box>

          {isAdding && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap", 
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: 2,
                gap: 2,
                marginBottom: 2,
              }}
            >
              <TextField
                label="Task Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <FormControl variant="outlined" sx={{ flexGrow: 1, minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  native
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  displayEmpty
                >
                  <option value="" disabled>Select Status</option>
                  <option value="todo">TO-DO</option>
                  <option value="in-progress">IN-PROGRESS</option>
                  <option value="completed">COMPLETED</option>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ flexGrow: 1, minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  native
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  displayEmpty
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTask}
                sx={{ minWidth: 120, minHeight:55 }}
              >
                ADD
              </Button>
              <Button variant="outlined" onClick={() => setIsAdding(false)} sx={{ minWidth: 120, minHeight:55 }}>
                CANCEL
              </Button>
            </Box>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableBody ref={setNodeRef}>
                {tasksList?.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">
                    No tasks found in To-do.
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

export default TodoListCard;
