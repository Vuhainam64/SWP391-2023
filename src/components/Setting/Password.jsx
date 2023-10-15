import { useState } from "react";
import { MdPassword } from "react-icons/md";
import UserAuthInput from "../Auth/UserAuthInput";
import { motion } from "framer-motion";

function Password() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div>
      <div className="mb-4">
        <p className="font-semibold text-xl text-gray-900">Password</p>
        <small>Manage your password.</small>
      </div>
      <UserAuthInput
        label="Current Pasword"
        placeholder="Password need more than 6 letter"
        isPassword={true}
        setStateFunction={setCurrentPassword}
        Icon={MdPassword}
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
      <div className="flex mt-4">
        <motion.div
          //   onClick={UpdatePassword}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center p-2 rounded-xl hover-bg-blue-700 cursor-pointer bg-blue-600"
        >
          <p className="text-xl text-white">Update Password</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Password;
