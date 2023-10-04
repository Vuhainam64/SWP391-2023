import React from "react";
import { Route, Routes } from "react-router-dom";
import DBHeader from "./DBHeader";
import DBHome from "./DBHome";
import DBUsers from "./DBUsers";

function DBRightSection() {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none ">
        <Routes>
          <Route path="/home" element={<DBHome />} />
          <Route path="/users" element={<DBUsers />} />
        </Routes>
      </div>
    </div>
  );
}

export default DBRightSection;
