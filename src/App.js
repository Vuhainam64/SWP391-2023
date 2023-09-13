import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Auth, Home, PageNotFound } from "./containers";
import { useEffect, useState } from "react";
import { auth, db } from "./config/firebase.config";
import { doc, setDoc } from "@firebase/firestore";
import { Spinner } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        console.log(userCred?.providerData[0]);
        setDoc(doc(db, "user", userCred?.uid), userCred?.providerData[0]).then(
          () => {
            //dispatch action to store
            dispatch(SET_USER(userCred?.providerData[0]));
            navigate("/home", { replace: true });
          }
        );
      } else {
        navigate("/auth", { replace: true });
      }

      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white dark:bg-notion-dark">
          <Routes>
            <Route path="/404" element={<PageNotFound />} />
            <Route path="/home/*" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            {/* if not matching  */}
            <Route path="*" element={<Navigate to={"/404"} />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
