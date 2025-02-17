import React, { useCallback, useState } from "react";
import TaskBuddy from "../components/TaskBuddyHeader.tsx";
import TaskViewScreen from "./TaskViewScreen.tsx";
import BoardViewScreen from "./BoardViewScreen.tsx";
import ActivityTabScreen from "./ActivityTabScren.tsx";

const Home = () => {
  const [view, setView] = useState("list");
  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleFilteredTasks = useCallback(
    (updatedTasks) => {
      setFilteredTasks(updatedTasks);
    },
    [setFilteredTasks]
  );

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  let content;

  switch (view) {
    case "list":
      content = <TaskViewScreen filteredTasks={filteredTasks} />;
      break;

    case "board":
      content = <BoardViewScreen filteredTasks={filteredTasks} />;
      break;

    case "activity":
      content = <ActivityTabScreen />;
      break;
  }
  return (
    <>
      <TaskBuddy
        onViewChange={handleViewChange}
        setFilteredTasks={handleFilteredTasks}
      />
      {content}
    </>
  );
};
export default Home;
