import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { database, ref, onValue, set, push, remove, update } from "../../auth/firebaseConfig.js";
import { activityApi } from "./activityApi.ts";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Task"],

  endpoints: (builder) => ({
    getTasks: builder.query({
      queryFn: () =>
        new Promise((resolve) => {
          const tasksRef = ref(database, "tasks");
          const unsubscribe = onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            resolve({
              data: data
                ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
                : [],
            });
          });

          return () => unsubscribe();
        }),
      providesTags: ["Task"],
    }),
    addTask: builder.mutation({
      async queryFn(newTask) {
        try {
          const taskRef = push(ref(database, "tasks"));
          await set(taskRef, newTask);
          return { data: { id: taskRef.key, ...newTask } };
        } catch (error) {
          return { error: error.message || "Failed to add task" };
        }
      },
      onQueryStarted: async (newTask, { dispatch, queryFulfilled }) => {
        try {
          // const { data } = await queryFulfilled;
          dispatch(activityApi.endpoints.logActivity.initiate({ 
            message: `Added new task: "${newTask.title}"` 
          }));
        } catch (error) {
          console.error("Failed to log activity:", error);
        }
      },
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      async queryFn(taskId) {
        try {
          await remove(ref(database, `tasks/${taskId}`));
          return { data: taskId };
        } catch (error) {
          return { error: error.message || "Failed to delete task" };
        }
      },
      onQueryStarted: async (taskId, { dispatch, queryFulfilled, getState }) => {
        const state = getState();
        const deletedTask = state.tasks?.tasksList?.find((task) => task.id === taskId);

        try {
          await queryFulfilled;
          dispatch(activityApi.endpoints.logActivity.initiate({
            message: deletedTask
              ? `Deleted task: "${deletedTask.title}"`
              : `Deleted task with ID: ${taskId}`
          }));
        } catch (error) {
          console.error("Failed to log activity:", error);
        }
      },
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      async queryFn({ taskId, updatedData }) {
        try {
          if (!taskId || typeof updatedData !== "object") {
            throw new Error("Invalid update payload");
          }

          await update(ref(database, `tasks/${taskId}`), updatedData);
          return { data: { id: taskId, ...updatedData } };
        } catch (error) {
          return { error: error.message || "Failed to update task" };
        }
      },
      onQueryStarted: async ({ taskId, updatedData }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(activityApi.endpoints.logActivity.initiate({
            message: `Updated task "${updatedData.title}" - New Data: ${JSON.stringify(updatedData)}`
          }));
        } catch (error) {
          console.error("Failed to log activity:", error);
        }
      },
      invalidatesTags: ["Task"],
    }),
    updateTaskStatus: builder.mutation({
      async queryFn({ taskId, newStatus }) {
        try {
          if (!taskId) {
            throw new Error("Task ID is missing");
          }

          await update(ref(database, `tasks/${taskId}`), { status: newStatus });
          return { data: { id: taskId, newStatus } };
        } catch (error) {
          return { error: error.message || "Failed to update task status" };
        }
      },
      onQueryStarted: async ({ taskId, newStatus }, { dispatch, queryFulfilled }) => {
        let patchResult;
        try {
          patchResult = dispatch(
            tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
              const task = draft.find((t) => t.id === taskId);
              if (task) {
                task.status = newStatus;
              }
            })
          );

          await queryFulfilled;
          dispatch(activityApi.endpoints.logActivity.initiate({
            message: `Updated status of task ID: ${taskId} to "${newStatus}"`
          }));
        } catch (error) {
          if (patchResult) patchResult.undo();
          console.error("Failed to update task status:", error);
        }
      },
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
