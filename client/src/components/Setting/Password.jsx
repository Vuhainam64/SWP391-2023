import React, { useState } from "react";
import { MdPassword } from "react-icons/md";
import UserAuthInput from "../Auth/UserAuthInput";
import { motion } from "framer-motion";
import { auth } from "../../config/firebase.config";
import { updatePassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { Link } from "react-router-dom";
import ResetPassword from "../Auth/ResetPassword";

function Password() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);

  const dispatch = useDispatch();

  const update = async () => {
    try {
      const user = auth.currentUser;

      // Xác thực lại người dùng
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      if (password === confirmPassword) {
        // Cập nhật mật khẩu
        await updatePassword(user, password);
        console.log("Password updated");
        dispatch(alertSuccess("Password updated"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        console.log("Passwords do not match");
        dispatch(alertDanger("Passwords do not match"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    } catch (error) {
      console.log(`Error updating password: ${error.message}`);
      dispatch(alertDanger(`Error updating password: ${error.message}`));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <p className="font-semibold text-xl text-gray-900">Password</p>
        <small>Manage your password.</small>
      </div>
      <UserAuthInput
        label="Current Password"
        placeholder="Enter your current password"
        isPassword={true}
        setStateFunction={setCurrentPassword}
        Icon={MdPassword}
        values={currentPassword}
      />
      <UserAuthInput
        label="New Password"
        placeholder="Password needs to be more than 6 characters"
        isPassword={true}
        setStateFunction={setPassword}
        Icon={MdPassword}
        values={password}
      />
      <UserAuthInput
        label="Confirm Password"
        placeholder="Confirm your new password"
        isPassword={true}
        setStateFunction={setConfirmPassword}
        Icon={MdPassword}
        values={password}
      />
      <div className="flex mt-4 justify-between">
        <motion.div
          onClick={update}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center p-2 rounded-xl hover-bg-blue-700 cursor-pointer bg-blue-600"
        >
          <p className="text-xl text-white">Update Password</p>
        </motion.div>
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
    </div>
  );
}

export default Password;
