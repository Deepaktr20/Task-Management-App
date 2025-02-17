import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  InputAdornment,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useUpdateTaskMutation } from "../store/api/tasksApi.ts";

interface Task {
  id: string;
  title: string;
  discription?: string;
  dueDate: string;
  status: string;
  category: string;
  image?: string;
}

const TaskUpdateModal: React.FC<{
  open: boolean;
  onClose: () => void;
  task: Task;
}> = ({ open, onClose, task }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.discription || "");
  const [date, setDate] = useState(task?.dueDate || "");
  const [category, setCategory] = useState(task?.category || "");
  const [status, setStatus] = useState(task?.status || "");
  const [image, setImage] = useState(task?.image || "");

  const [updateTask] = useUpdateTaskMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.discription || "");
      setDate(task.date || "");
      setCategory(task.category || "");
      setStatus(task.status || "");
      setImage(task.image || "");
    }
  }, [task]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      console.log(image);
    }
  };
  const handleUpdateTask = async() => {
    const updatedData = {
      category,
      date,
      description,
      status,
      title,
    };
    await updateTask({taskId:task.id,updatedData});
    onClose();
    setTitle("");
    setDescription("");
    setDate("");
    setStatus("");
    setCategory("work");
    setImage("");
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Update Task
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Task Title */}
        <TextField
          label="Task title"
          fullWidth
          margin="dense"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description Field with Formatting Icons */}
        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          margin="dense"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FormatBoldIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <FormatItalicIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <FormatStrikethroughIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <FormatListBulletedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Task Category */}
        <Typography variant="subtitle2" mt={2}>
          Task Category*
        </Typography>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(e, newCategory) => setCategory(newCategory)}
          sx={{ mt: 1 }}
        >
          <ToggleButton value="work">Work</ToggleButton>
          <ToggleButton value="personal">Personal</ToggleButton>
        </ToggleButtonGroup>

        {/* Due Date & Task Status */}
        <Box display="flex" gap={2} mt={2}>
          <TextField
            type="date"
            label="Due on*"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* <CalendarMonthIcon /> */}
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Choose Status
            </MenuItem>
            <MenuItem value="todo">To-Do</MenuItem>
            <MenuItem value="in-progress">In-Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Box>

        {/* File Upload */}
        <Typography variant="subtitle2" mt={3}>
          Attachment
        </Typography>
        <Box
          sx={{
            border: "1px dashed #aaa",
            borderRadius: 1,
            p: 2,
            mt: 1,
            textAlign: "center",
            cursor: "pointer",
            color: "#666",
          }}
          onClick={handleClick}
        >
          <CloudUploadIcon sx={{ fontSize: 24, mb: 1 }} />
          <Typography variant="body2">
            Drop your files here or{" "}
            <span style={{ color: "blue" }}>Update</span>
          </Typography>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#AF71C6" }}
          onClick={handleUpdateTask}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskUpdateModal;
