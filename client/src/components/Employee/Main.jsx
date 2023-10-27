import { Route, Routes } from "react-router-dom";
import { DBHeader } from "../Admin";
import Feedbacks from "./Feedbacks";
import Completes from "./Completes";
import Tasks from "./Tasks";
import TaskDetails from "./TaskDetails";

function Main() {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-scroll scrollbar-track-inherit ">
        <Routes>
          <Route path="/" element={<Feedbacks />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/id" element={<TaskDetails />} />
          <Route path="/completes" element={<Completes />} />
        </Routes>
      </div>
    </div>
  );
}

export default Main;
