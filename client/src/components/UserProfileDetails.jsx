import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { Menus, signOutAction } from "../ultils/helpers";
import { Link } from "react-router-dom";
import { Avatar } from "../assets";
import { useState } from "react";

function UserProfileDetails() {
  const user = useSelector((state) => state.user?.user);
  const [isMenu, setIsMenu] = useState(false);

  return (
    <div className="flex items-center justify-center w-full rounded-md px-4 py-2 text-sm text-gray-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
      <motion.img
        whileHover={{ scale: 1.2 }}
        src={user?.photoURL ? user?.photoURL : Avatar}
        alt="avatar"
        className="rounded-full w-6 h-6"
      />
      <p className="ml-2 hidden sm:inline">{user?.displayName}</p>
      <motion.div
        onClick={() => setIsMenu(!isMenu)}
        whileTap={{ scale: 0.9 }}
        className="p-4 rounded-md flex items-center justify-center cursor-pointer"
      >
        <FaChevronDown className="text-primary" />
      </motion.div>

      <AnimatePresence>
        {isMenu && (
          <motion.div className=" absolute top-16 right-0 px-4 py-3 rounded-xl shadow-md z-10 flex flex-col items-start justify-start gap-4 min-w-[225px] bg-white">
            <Link
              to={"/admin"}
              className="text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 items-center w-full px-2 py-1 rounded-md"
            >
              Dashboard
            </Link>
            {Menus &&
              Menus.map((menu) => (
                <Link
                  to={menu.uri}
                  key={menu.id}
                  className="text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 items-center w-full px-2 py-1 rounded-md"
                >
                  {menu.name}
                </Link>
              ))}
            <motion.p
              onClick={signOutAction}
              whileTap={{ scale: 0.9 }}
              className="text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 items-center w-full px-2 py-1 rounded-md"
            >
              Log Out
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfileDetails;
