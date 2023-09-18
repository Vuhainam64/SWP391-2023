import { useState } from "react";
import UserAuthInput from "./UserAuthInput";
import { FaEnvelope } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../config/firebase.config";
import ResetPassword from "./ResetPassword";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);

  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const loginWithEmailPassword = async () => {
    if (getEmailValidationStatus) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
            props.setAlert(true);
            props.setAlertMessage("Login successful.");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.message.includes("user-not-found")) {
            props.setAlert(true);
            props.setAlertMessage("Invalid Id: User not found");
          } else if (err.message.includes("wrong-password")) {
            props.setAlert(true);
            props.setAlertMessage("Password is incorrect");
          } else {
            props.setAlert(true);
            props.setAlertMessage(
              "Temporarily disabled due to many failed logins"
            );
          }

          setInterval(() => {
            props.setAlert(false);
          }, 4000);
        });
    }
  };
  return (
    <>
      <UserAuthInput
        label="Email"
        placeholder="example@gmail.com"
        isPassword={false}
        setStateFunction={setEmail}
        Icon={FaEnvelope}
        setGetEmailValidationStatus={setGetEmailValidationStatus}
      />
      <UserAuthInput
        label="Password"
        placeholder="Password need more than 6 letter"
        isPassword={true}
        setStateFunction={setPassword}
        Icon={MdPassword}
      />
      <div className="relative flex items-center my-5">
        <div className="flex items-center w-full md:w-1/2">
          <input
            type="checkbox"
            className="rounded border-gray-500 cursor-pointer w-3 h-3"
          />
          <label className="text-gray-700 ml-2"> Remember Me </label>
        </div>
        <div className="w-full md:w-1/2 text-right">
          <Link
            onClick={() => setIsForgot(!isForgot)}
            className="text-xs hover:underline text-gray-500 sm:text-sm hover:text-gray-700"
          >
            Forgot your password?
          </Link>
          {isForgot && <ResetPassword setIsForgot={setIsForgot} />}
        </div>
      </div>
      <motion.div
        onClick={loginWithEmailPassword}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-blue-500 cursor-pointer bg-blue-600"
      >
        <p className="text-xl text-white">Login</p>
      </motion.div>
    </>
  );
}

export default Login;
