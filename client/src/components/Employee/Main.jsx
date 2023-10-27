import { Route, Routes } from "react-router-dom";
import { DBHeader } from "../Admin";
import Feedbacks from "./Feedbacks";
import Pendings from "./Pendings";
import Completes from "./Completes";

function Main() {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none ">
        <Routes>
          <Route path="/" element={<Feedbacks />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/pendings" element={<Pendings />} />
          <Route path="/completes" element={<Completes />} />
        </Routes>
      </div>
    </div>
  );
}

export default Main;
