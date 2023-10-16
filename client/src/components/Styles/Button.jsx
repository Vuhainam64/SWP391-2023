import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
function Button({ text }) {
  return (
    <motion.div
      {...buttonClick}
      className="outline-none text-white bg-slate-700 m-1 rounded-md"
    >
      <div className="px-6 py-1">{text}</div>
    </motion.div>
  );
}

export default Button;
