import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Home, Login } from "./containers";
import { useEffect } from "react";
import { auth } from "./config/firebase.config";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
      } else {
        navigate("/home/auth", { replace: true });
      }
    });
  });

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
