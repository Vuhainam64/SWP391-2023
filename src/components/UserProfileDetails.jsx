import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";

function UserProfileDetails() {
  const user = useSelector((state) => state.user?.user);

  return (
    <div className="flex items-center justify-center w-full rounded-md px-4 py-2 text-sm text-gray-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
      <motion.img
        whileHover={{ scale: 1.2 }}
        src={user?.photoURL}
        alt="avatar"
        className="rounded-full w-6 h-6"
      />
      <p className="ml-2 hidden sm:inline">{user?.displayName}</p>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="p-4 rounded-md flex items-center justify-center cursor-pointer"
      >
        <FaChevronDown className="text-primary" />
      </motion.div>
    </div>
  );
}

export default UserProfileDetails;
