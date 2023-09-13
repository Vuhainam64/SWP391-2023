import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Auth, Home, PageNotFound } from "./containers";
import { useEffect } from "react";
import { auth } from "./config/firebase.config";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        console.log(userCred?.providerData[0]);
      } else {
        navigate("/home/auth", { replace: true });
      }
    });
  });

  return (
    <div className="bg-white dark:bg-notion-dark">
      <Routes>
        <Route path="/404" element={<PageNotFound />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />

        {/* if not matching  */}
        <Route path="*" element={<Navigate to={"/404"} />} />
      </Routes>
    </div>
  );
}

export default App;
