import { configureStore } from "@reduxjs/toolkit";
import { taskReducer,addTask,updateTask,removeTask,updateTaskStatus ,trackTaskActionsMiddleware} from "./slices/taskSlice";
import { activityReducer } from "./slices/activitySlice.js";

const store=configureStore({
    reducer:{
        tasks:taskReducer,
        activities:activityReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(trackTaskActionsMiddleware)
})
export type RootState = ReturnType<typeof store.getState>;
export { store,addTask,removeTask,updateTask,updateTaskStatus };