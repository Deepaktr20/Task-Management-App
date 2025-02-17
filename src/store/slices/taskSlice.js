import { createSlice, nanoid } from "@reduxjs/toolkit";
import { logEvents } from "./activitySlice";

const taskSlice=createSlice({
    name:"task",
    initialState:{
        data:[
          {
            id: "1",
            title: "Grocery Shopping",
            description: "",
            dueDate: "2024-03-15",
            status: "todo",
            category: "Work",
            image: "",
          },
          {
            id: "2",
            title: "Work Report",
            description: "",
            dueDate: "2024-03-18",
            status: "in-progress",
            category: "Work",
            image: "",
          },
          {
            id: "3",
            title: "Pay Bills",
            description: "",
            dueDate: "2024-03-20",
            status: "todo",
            category: "Personal",
            image: "",
          },
          {
            id: "4",
            title: "Book Tickets",
            description: "",
            dueDate: "2024-03-22",
            status: "completed",
            category: "Personal",
            image: "",
          },
          {
            id: "5",
            title: "Meeting with Team",
            description: "",
            dueDate: "2024-03-25",
            status: "in-progress",
            category: "Work",
            image: "",
          },
        ]
    },
    reducers:{
        addTask(state,action){
            state.data.push({
                id:nanoid(),
                title:action.payload.title,
                description:action.payload.description,
                category:action.payload.category,
                dueDate:action.payload.date,
                status:action.payload.status,
                image:action.payload.image
            })
        },
        updateTask(state,action){
            const taskToUpdate = action.payload;
            state.data = state.data.map((task) =>
            task.id === action.payload.id ? taskToUpdate : task
        );
        },
        removeTask(state,action){
            state.data = state.data.filter(
                (task) => task.id !== action.payload
            );
        },
        updateTaskStatus: (state, action) => {
            const { id, newStatus } = action.payload;
            
            const task = state.data.find((task) => task.id === id);
            if (task) {
              task.status = newStatus;
            }
        },
    }
})
// Middleware
export const trackTaskActionsMiddleware = (storeAPI) => (next) => (action) => {
    const result = next(action);
   
    const state = storeAPI.getState();
    const tasksList = state.tasks.data;
   
    if (action.type.includes("task/")) {
      let message = "";
   
      switch (action.type) {
        case "task/addTask":
          message = `Added new task: "${action.payload.title}"`;
          break;
        case "task/updateTask":
          message = `Updated task "${action.payload.title}" - Status To: ${action.payload.status}`;
          break;
        case "task/removeTask": {
          const deletedTask = tasksList.find(
            (task) => task.id === action.payload
          );
          message = deletedTask
            ? `Deleted task: "${deletedTask.title}"`
            : `Deleted task with ID: ${action.payload}`;
          break;
        }
        case "task/updateTaskStatus":
          message = `Updated status of task ID: ${action.payload.id} to "${action.payload.newStatus}"`;
          break;
        default:
          message = "Performed a task action";
      }
   
      storeAPI.dispatch(logEvents(message));
    }
    return result;
};
export const { addTask,updateTask,removeTask,updateTaskStatus } = taskSlice.actions;
export const taskReducer = taskSlice.reducer;