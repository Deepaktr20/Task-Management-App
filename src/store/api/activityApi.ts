import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { database, ref, onValue, push, set } from "../../auth/firebaseConfig.js";

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["ActivityLogs"],

  endpoints: (builder) => ({
    logActivity: builder.mutation({
      async queryFn(logEntry) {
        try {
          const logRef = push(ref(database, "activityLogs/"));
          await set(logRef, {
            id: logRef.key,
            message: logEntry.message,
            timeStamp: new Date().toISOString(),
          });

          return { data: logEntry };
        } catch (error) {
          return { error: error.message || "Failed to log activity" };
        }
      },
      invalidatesTags: ["ActivityLogs"],
    }),
    getActivityLogs: builder.query({
      queryFn: () =>
        new Promise((resolve) => {
          const logsRef = ref(database, "activityLogs/");
          const unsubscribe = onValue(logsRef, (snapshot) => {
            const data = snapshot.val();
            resolve({
              data: data
                ? Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                  }))
                : [],
            });
          });
          return () => unsubscribe();
        }),
      providesTags: ["ActivityLogs"],
    }),
  }),
});

export const { useLogActivityMutation, useGetActivityLogsQuery } = activityApi;
