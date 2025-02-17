import React from "react";
import RenderBoardCard from "./RenderBoardCard.tsx";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, Typography } from "@mui/material";

const ToDoBoard = ({ id, tasks }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-yellow-100 w-full md:w-1/3 h-full p-4 rounded-lg shadow-md"
    >
      {" "}
      <div className="bg-white w-full p-6 rounded-lg shadow-inner">
        {" "}
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          TO-DO
        </h3>
        <div className="space-y-3">
          {tasks?.length > 0 ? (
            <div className="space-y-3">
              {tasks?.map((task) => (
                <RenderBoardCard task={task} key={task.id} />
              ))}
            </div>
          ) : (
            <Card className="shadow-md border-l-4 border-blue-500 mb-3 p-4">
              <CardContent>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-500"
                >
                  No Tasks To Display
                </Typography>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoBoard;
