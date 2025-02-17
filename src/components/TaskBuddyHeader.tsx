import React, { useState, useMemo, useEffect } from "react";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { AccessTime, Logout, Search } from "@mui/icons-material";
import TaskModal from "./TaskModal.tsx";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import { auth } from "../auth/firebaseConfig.js";
import { useNavigate } from "react-router";
import { useGetTasksQuery } from "../store/api/tasksApi.ts";

interface HeaderProps {
  onViewChange: (view: "list" | "board" | "activity") => void;
  setFilteredTasks: (tasks: any[]) => void;
}

// @ts-ignore
const TaskBuddy: React.FC<HeaderProps> = ({
  onViewChange,
  setFilteredTasks,
}) => {
  const [filterText, setFilterText] = useState("");
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<
    [DateObject | null, DateObject | null]
  >([null, null]);
  const { data: tasks } = useGetTasksQuery();
  const tasksList = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);
  const navigate = useNavigate();
  const taskCategories = ["All", "work", "personal", "shopping"];

  useEffect(() => {
    const filtered = tasksList?.filter((task) => {
      const textMatch = task.title
        .toLowerCase()
        .includes(filterText.toLowerCase());
      const categoryMatch = category === "All" || task.category === category;
      let dateMatch = true;
      if (dateRange[0] && dateRange[1]) {
        const taskDate = new Date(task.dueDate);
        dateMatch =
          taskDate >= dateRange[0]?.toDate() &&
          taskDate <= dateRange[1]?.toDate();
      }
      return textMatch && dateMatch && categoryMatch;
    });
    setFilteredTasks(filtered);
  }, [filterText, dateRange, category, tasksList,setFilteredTasks]);

  const handleClearFilter = () => {
    setDateRange([null, null]);
    setCategory("All");
    setFilterText("");
  };

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <header className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/task.png"
            alt="TaskBuddy Logo"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-semibold text-gray-800">TaskBuddy</h1>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow border border-gray-200">
          <img
            src={
              auth.currentUser?.photoURL ||
              "https://randomuser.me/api/portraits/men/75.jpg"
            }
            className="w-10 h-10 rounded-full border-2 border-purple-500"
            alt="User Avatar"
          />
          <div>
            <span className="text-gray-600 text-sm">Welcome,</span>
            <span className="text-gray-800 font-semibold block">
              {auth.currentUser?.displayName || "Guest"}
            </span>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex flex-wrap items-center justify-between gap-4">
        <nav className="flex items-center gap-4">
          {[
            { label: "List", icon: <FormatListNumberedIcon />, view: "list" },
            { label: "Board", icon: <SpaceDashboardIcon />, view: "board" },
            { label: "Activity", icon: <AccessTime />, view: "activity" },
          ].map(({ label, icon, view }) => (
            <button
              key={label}
              className="flex items-center gap-1 text-gray-800 hover:text-purple-700"
              onClick={() => onViewChange(view)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex justify-end w-full md:w-auto">
        <button
          className="bg-gray-100 flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-200"
          onClick={handleLogOut}
        >
          <Logout className="text-gray-600" />
          <span className="flex text-gray-700">Logout</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-500 font-medium">Filter by:</span>
          <FormControl size="small">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border-gray-300"
            >
              {taskCategories.map((categoryOption) => (
                <MenuItem key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex items-center gap-2">
            <DatePicker
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              range
              placeholder="Select date"
              numberOfMonths={1}
              format="DD-MM-YYYY"
              className="border border-gray-300 rounded-lg px-2 py-1 w-full md:w-auto"
              style={{ height: "42px", fontSize: "16px", borderRadius: "10px" }}
            />
            <Button
              variant="outlined"
              onClick={handleClearFilter}
              className="rounded-lg"
              sx={{ height: "42px" }}
              style={{ height: "42px" }}
            >
              X
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full border-gray-300">
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-transparent text-gray-700 focus:outline-none"
            />
          </div>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            onClick={() => setOpen(true)}
          >
            ADD TASK
          </button>
        </div>
      </div>
      <TaskModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
};

export default TaskBuddy;
