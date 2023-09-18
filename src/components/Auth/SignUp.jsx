import { FaEnvelope } from "react-icons/fa6";
import UserAuthInput from "./UserAuthInput";
import { useState } from "react";
import { MdPassword } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "@firebase/auth";
import { auth } from "../../config/firebase.config";

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const createNewUser = async () => {
    if (!agreedToTerms) {
      setAlert(true);
      setAlertMessage("You must agree to the terms and conditions.");
      return;
    }
    if (getEmailValidationStatus) {
      if (password !== confirmPassword) {
        setAlert(true);
        setAlertMessage("Passwords do not match.");
        return;
      }
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCred) {
          await updateProfile(userCred.user, {
            displayName: name,
          });
          await sendEmailVerification(userCred.user);
          console.log(userCred);
          setAlert(true);
          setAlertMessage(
            "Account created successfully. Please check your email for verification."
          );
        }
      } catch (error) {
        // Handle Firebase errors here
        setAlert(true);
        if (error.code === "auth/missing-password") {
          setAlertMessage("Password is required.");
        } else if (error.code === "auth/email-already-in-use") {
          setAlertMessage("Email has already been used.");
        } else {
          setAlertMessage("An error occurred while creating the account.");
        }
        setInterval(() => {
          setAlert(false);
        }, 4000);
      }
    }
  };

  return (
    <>
      <UserAuthInput
        label="Name"
        placeholder="Your name"
        isPassword={false}
        setStateFunction={setName}
        Icon={RxAvatar}
      />
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
      <UserAuthInput
        label="Confirm Password"
        placeholder="Confirm your password"
        isPassword={true}
        setStateFunction={setConfirmPassword}
        Icon={MdPassword}
      />
      <div className="relative mb-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-500 cursor-pointer w-5 h-5"
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
          />
          <label className="text-gray-700 ml-2 text-sm mt-3">
            I agree with the{" "}
            <Link to={"/terms-conditions"} className="text-blue-500">
              Terms and conditions
            </Link>{" "}
            and{" "}
            <Link to={"/privacy-policy"} className="text-blue-500">
              Privacy policy
            </Link>{" "}
            of the website and I accept them.
          </label>
        </div>
      </div>
      <motion.div
        onClick={createNewUser}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-blue-500 cursor-pointer bg-blue-600"
      >
        <p className="text-xl text-white">Create an account</p>
      </motion.div>
      {alert && <div className="text-red-500">{alertMessage}</div>}
    </>
  );
}

export default SignUp;
