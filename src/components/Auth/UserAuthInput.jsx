import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { motion } from "framer-motion";

function UserAuthInput({
  label,
  placeholder,
  isPassword,
  setStateFunction,
  Icon,
  setGetEmailValidationStatus,
}) {
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue); // Set the local state
    setStateFunction(inputValue); // Update the parent state

    if (placeholder === "example@gmail.com") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
      const isValid = emailRegex.test(inputValue);
      setIsEmailValid(isValid);
      setGetEmailValidationStatus(isValid);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <label className="text-sm text-gray-700 py-2">
        {label} <span className="text-red-500 required-dot">*</span>
      </label>
      <div
        className={`flex items-center justify-center gap-3 w-full h-full px-4 py-1 rounded-lg border-gray-300 border bg-white ${
          !isEmailValid &&
          placeholder === "example@gmail.com" &&
          value.length > 0
            ? "border-2 border-red-500"
            : ""
        }`}
      >
        <Icon className="text-text555 text-2xl" />
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          placeholder={placeholder}
          className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
          value={value} // Use the local state for value
          onChange={handleTextChange} // Handle input changes
        />

        {isPassword && (
          <motion.div
            onClick={() => setShowPassword(!showPassword)}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            {showPassword ? (
              <FaEyeSlash className="text-blue-500 text-2xl" />
            ) : (
              <FaEye className="text-blue-500 text-2xl" />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default UserAuthInput;
