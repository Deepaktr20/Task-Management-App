import React from "react";
import { useGetActivityLogsQuery } from "../store/api/activityApi.ts";
 
const ActivityTabScreen = () => {
  const { data: logs } = useGetActivityLogsQuery();

  const activityLogs = logs;

  console.log(activityLogs);
 
  return (
    <div className="bg-gray-100 min-h-screen p-4 w-full">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
          Activity Log
        </h2>
        <ul className="space-y-3">
          {activityLogs?.length > 0 ? (
            activityLogs?.map((log) => (
              <li
                key={log.id}
                className="bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 border-blue-500"
              >
                <strong className="text-gray-700">
                  {new Date(log.timeStamp).toLocaleString()}
                </strong>
                <p className="text-gray-600">{log.message}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No activity logs available.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};
 
export default ActivityTabScreen;