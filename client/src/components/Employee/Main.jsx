import { Route, Routes } from "react-router-dom";
import { DBHeader } from "../Admin";
import Completes from "./Completes";
import Feedbacks from "./Feedbacks";
import TaskDetails from "./TaskDetails";
import Tasks from "./Tasks";
import Calendar from "./Calendar";
import Home from "./Home";

function Main() {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-track-inherit ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:feedbackId" element={<TaskDetails />} />
          <Route path="/completes" element={<Completes />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </div>
  );
}

export default Main;
