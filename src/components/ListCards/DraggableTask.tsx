import React from "react";
import {
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Select,
    TableCell,
    TableRow,
    useMediaQuery,
    useTheme,
  } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDraggable } from "@dnd-kit/core";
import { useUpdateTaskMutation } from "../../store/api/tasksApi.ts";

interface Task {
    id: string;
    title: string;
    date: string;
    status: string;
    category: string;
}

interface TaskProps {
    task: Task;
    selectedTasks: string[];
    toggleTaskSelection: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    menuAnchor: HTMLElement | null;
    setMenuAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const DraggableTask: React.FC<TaskProps> = ({ task, selectedTasks, toggleTaskSelection, menuAnchor, setMenuAnchor, onEdit, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
    const [updateTask] = useUpdateTaskMutation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "none",
    };
    console.log(task);
    
    return (
        <TableRow 
            key={task.id} 
            selected={selectedTasks.includes(task.id)} 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes} 
            style={style}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    sx={{
                        color: "#1B8D17",
                        '&.Mui-checked': { color: "#1B8D17" },
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                />
            </TableCell>

            <TableCell className={task.status === "completed" ? "line-through" : ""}>
                {task.title}
            </TableCell>

            {!isMobile && <TableCell>{task.date}</TableCell>}
            {!isMobile && (
                <TableCell>
                    <Select
                        native
                        value={task.status}
                        onChange={(e) => {
                            const updatedStatus = e.target.value as Task["status"];
                            const updatedData = { ...task, status: updatedStatus };
                            updateTask({ taskId: task.id, updatedData });
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <option value="todo">TO-DO</option>
                        <option value="in-progress">IN-PROGRESS</option>
                        <option value="completed">COMPLETED</option>
                    </Select>
                </TableCell>
            )}
            {!isMobile && <TableCell>{task.category}</TableCell>}
            <TableCell>
                <IconButton onClick={(event) => setMenuAnchor(event.currentTarget)} onPointerDown={(e) => e.stopPropagation()}>
                    <MoreHorizIcon />
                </IconButton>
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <MenuItem onClick={() => onEdit(task)} onPointerDown={(e) => e.stopPropagation()}>
                        <EditIcon fontSize="small" /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => onDelete(task.id)} onPointerDown={(e) => e.stopPropagation()}>
                        <DeleteIcon fontSize="small" color="error" /> Delete
                    </MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default DraggableTask;
