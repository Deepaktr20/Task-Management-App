import { createSlice, nanoid } from "@reduxjs/toolkit";
 
const acticitySlice = createSlice({
  name: "activity",
  initialState: {
    logs: [],
  },
  reducers: {
    logEvents(state, action) {
      state.logs.push({
        id: nanoid(),
        message: action.payload,
        timeStamp: new Date().toISOString(),
      });
    },
  },
});
// Middleware
export const trackTaskActionsMiddleware = (storeAPI) => (next) => (action) => {
    const result = next(action);
   
    const state = storeAPI.getState();
    const tasksList = state.tasks.tasksList;
   
    if (action.type.includes("taskList/")) {
      let message = "";
   
      switch (action.type) {
        case "taskList/addTask":
          message = `Added new task: "${action.payload.name}"`;
          break;
        case "taskList/updateTask":
          message = `Updated task "${action.payload.name}" - Status To: ${action.payload.status}`;
          break;
        case "taskList/deleteTask": {
          const deletedTask = tasksList.find(
            (task) => task.id === action.payload
          );
          message = deletedTask
            ? `Deleted task: "${deletedTask.name}"`
            : `Deleted task with ID: ${action.payload}`;
          break;
        }
        case "taskList/updateTaskStatus":
          message = `Updated status of task ID: ${action.payload.id} to "${action.payload.newStatus}"`;
          break;
        default:
          message = "Performed a task action";
      }
   
      storeAPI.dispatch(logEvents(message));
    }
    return result;
}
 
export const { logEvents } = acticitySlice.actions;
export const activityReducer = acticitySlice.reducer;