import React, { useRef, useState } from "react";
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
import { useAddTaskMutation } from "../store/api/tasksApi.ts";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("work");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [addTask] = useAddTaskMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleCreateTask = async () => {
    await addTask({ title, description, date, category, status, image });
    onClose();
    setTitle("");
    setDescription("");
    setDate("");
    setStatus("");
    setCategory("work");
    setImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Create Task
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField label="Task title" fullWidth margin="dense" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Description" multiline rows={3} fullWidth margin="dense" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {[FormatBoldIcon, FormatItalicIcon, FormatStrikethroughIcon, FormatListBulletedIcon].map((Icon, idx) => (
                  <IconButton key={idx} size="small"><Icon fontSize="small" /></IconButton>
                ))}
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="subtitle2" mt={2}>Task Category*</Typography>
        <ToggleButtonGroup value={category} exclusive onChange={(e, newCategory) => setCategory(newCategory)} sx={{ mt: 1 }}>
          <ToggleButton value="work">Work</ToggleButton>
          <ToggleButton value="personal">Personal</ToggleButton>
        </ToggleButtonGroup>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mt={2}>
          <TextField type="date" label="Due on*" value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty fullWidth>
            <MenuItem value="" disabled>Choose Status</MenuItem>
            <MenuItem value="todo">To-Do</MenuItem>
            <MenuItem value="in-progress">In-Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Box>

        <Typography variant="subtitle2" mt={3}>Attachment</Typography>
        <Box sx={{ border: "1px dashed #aaa", borderRadius: 1, p: 2, mt: 1, textAlign: "center", cursor: "pointer", width: "100%" }} onClick={handleClick}>
          <CloudUploadIcon sx={{ fontSize: 24, mb: 1 }} />
          <Typography variant="body2">Drop your files here or <span style={{ color: "blue" }}>Update</span></Typography>
          <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        <Button onClick={onClose} variant="outlined" fullWidth>Cancel</Button>
        <Button variant="contained" sx={{ bgcolor: "#AF71C6", mt: { xs: 1, sm: 0 } }} onClick={handleCreateTask} fullWidth>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
