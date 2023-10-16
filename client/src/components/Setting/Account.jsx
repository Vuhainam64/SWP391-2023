import { motion } from "framer-motion";

function Account() {
  return (
    <div>
      <div className="mb-4">
        <p className="font-semibold text-xl text-gray-900">Danger zone</p>
        <small>
          This will permanently delete your entire account. All your forms,
          submissions and workspaces will be deleted.{" "}
          <span className="text-red-500"> This cannot be undone. </span>
        </small>
      </div>
      <div className="flex mt-4">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center p-2 rounded-xl hover-bg-blue-700 cursor-pointer bg-red-600 hover:bg-red-700"
        >
          <p className="text-xl text-white">Update Password</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Account;
