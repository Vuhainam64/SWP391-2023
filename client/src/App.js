import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Auth,
  CreateFeedback,
  Dashboard,
  Feedbacks,
  Home,
  PageNotFound,
  Setting,
  Staff,
  Templates,
} from "./containers";
import { useEffect, useState } from "react";
import { auth, db } from "./config/firebase.config";
import { doc, setDoc } from "@firebase/firestore";
import { Spinner, VerifyPopup } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const dispatch = useDispatch();
  const userRole = "admin";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (userCred) => {
        if (userCred) {
          setIsLogin(true);
          console.log(userCred?.providerData[0]);
          setDoc(
            doc(db, "user", userCred?.uid),
            userCred?.providerData[0]
          ).then(() => {
            dispatch(SET_USER(userCred?.providerData[0]));
            if (userCred.emailVerified) {
              setIsEmailVerified(true);
            } else {
              setIsEmailVerified(false);
              navigate("/auth", { replace: true });
            }
          });
        } else {
          navigate("/auth", { replace: true });
        }

        setInterval(() => {
          setIsLoading(false);
        }, 1000);
      },
      [dispatch, navigate]
    );

    return () => unsubscribe();
    // eslint-disable-next-line
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

            {!isLogin && (
              <>
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            )}

            {isLogin && !isEmailVerified && (
              <>
                <Route path="/verify" element={<VerifyPopup />} />
                <Route path="*" element={<Navigate to="/verify" />} />
              </>
            )}

            {isLogin && isEmailVerified && (
              <>
                <Route path="/feedback" element={<Feedbacks />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/setting/*" element={<Setting />} />
                <Route path="/create-feedback" element={<CreateFeedback />} />

                {userRole === "employee" && (
                  <Route path="/staff" element={<Staff />} />
                )}
                {userRole === "admin" && (
                  <Route path="/admin/*" element={<Dashboard />} />
                )}
              </>
            )}

            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
