import { AiOutlineCheck } from "react-icons/ai";
import { Footer, Navbar, SignUp } from "../components";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { fadeInOut } from "../animations";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

function CreateAccount() {
  const { signupId } = useParams();

  const [isLogin] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (alert) {
      const timeoutId = setTimeout(() => {
        setAlert(false);
        setAlertMessage("");
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [alert]);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="flex mt-6 mb-10">
          <div
            className={`w-full md:max-w-6xl mx-auto px-4 flex md:flex-row-reverse flex-wrap ${
              isLogin ? "" : "items-center"
            }`}
          >
            <div className="w-full md:w-1/2 md:p-6">
              <div className="border rounded-md p-6 shadow-md sticky top-4">
                <div>
                  <h2 className="font-semibold text-2xl">Create an account</h2>
                  <small>Sign up in less than 2 minutes.</small>
                  <SignUp
                    setAlert={setAlert}
                    setAlertMessage={setAlertMessage}
                    signupId={signupId}
                  />
                  <AnimatePresence>
                    {alert && (
                      <motion.p
                        key={"Alert Message"}
                        {...fadeInOut}
                        className="text-red-500"
                      >
                        {alertMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="text-gray-500 mt-4">
                    {" "}
                    Already have an account?{" "}
                    <Link
                      to={"/auth"}
                      className="font-semibold ml-1 text-blue-500 text-base cursor-pointer"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            {/* Context form  */}
            <div className="w-full md:w-1/2 md:p-6 mt-8 md:mt-0">
              <h1 className="font-bold text-3xl">
                {" "}
                Easy to create feedback - save time for solutions{" "}
              </h1>
              <p className="text-gray-900 my-4 text-lg">
                {" "}
                If you have problems with the facilities, you can easily send us
                feedback now because it's free.{" "}
              </p>
              <div className="flex flex-wrap justify-center">
                <div className="flex items-center text-gray-400 text-sm  px-3 pb-3 ">
                  <AiOutlineCheck className=" text-blue-600 " />
                  <span>Unlimited forms</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm  px-3 pb-3 ">
                  <AiOutlineCheck className=" text-blue-600" />
                  <span> Unlimited fields </span>
                </div>
                <div className="flex items-center text-gray-400 text-sm  px-3 pb-3 ">
                  <AiOutlineCheck className=" text-blue-600" />
                  <span>Unlimited responses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateAccount;
