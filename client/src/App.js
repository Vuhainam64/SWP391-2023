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
import { auth } from "./config/firebase.config";
import { Spinner, VerifyPopup } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { updateUserDocument } from "./ultils/helpers";
import { getUserRole } from "./api";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  const handleAuthStateChanged = async (userCred) => {
    if (userCred) {
      setIsLogin(true);
      const userRole = await getUserRole(userCred.uid, userCred.accessToken);
      console.log("UserCred: ", userCred);
      console.log("User role: ", userRole);
      setUserRole(userRole);
      const userData = {
        ...userCred.providerData[0],
        emailVerified: userCred.emailVerified,
        creationTime: userCred.metadata.creationTime,
        lastSignInTime: userCred.metadata.lastSignInTime,
        role: userRole,
      };
      await updateUserDocument(userCred, userData);
      dispatch(SET_USER(userData));
      if (userCred.emailVerified) {
        setIsEmailVerified(true);
      } else {
        setIsEmailVerified(false);
        navigate("/auth", { replace: true });
      }
    } else {
      navigate("/auth", { replace: true });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);
    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white">
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
