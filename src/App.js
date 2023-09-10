import { Navigate, Route, Routes } from "react-router";
import { Home, Login } from "./containers";

function App() {
  return (
    <div className="bg-white dark:bg-notion-dark">
      <Routes>
        <Route path="/home/*" element={<Home />} />
        <Route path="/login/*" element={<Login />} />

        {/* if not matching  */}
        <Route path="*" element={<Navigate to={"/home"} />} />
      </Routes>
    </div>
  );
}

export default App;
