import React from "react";
import { Route, Routes } from "react-router-dom";
import DBHeader from "./DBHeader";
import DBHome from "./DBHome";
import DBUsers from "./DBUsers";
import Calendar from "./Calendar";
import ViewFeedback from "./ViewFeedback";
import Employee from "./Employee";
import Task from "./Task";
import DBRoles from "./DBRoles";
import Facility from "./Facility";
import Room from "./Room";
import Campus from "./Campus";
import FeedbackHandle from "./FeedbackHandle";
import CreateUser from "./CreateUser";

function DBRightSection() {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none ">
        <Routes>
          <Route path="/" element={<DBHome />} />
          <Route path="/users" element={<DBUsers />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/roles" element={<DBRoles />} />
          <Route path="/verify-feedback" element={<ViewFeedback />} />
          <Route path="/feedback-handle" element={<FeedbackHandle />} />
          <Route path="/task/:employeeId" element={<Task />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/room" element={<Room />} />
          <Route path="/facility" element={<Facility />} />

          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </div>
  );
}

export default DBRightSection;
