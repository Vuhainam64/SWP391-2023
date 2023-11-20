import { AiOutlineCheck } from "react-icons/ai";
import { Footer, Login, Navbar, SignUp } from "../components";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { fadeInOut } from "../animations";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogleCustom } from "../ultils/helpers";
import { Link } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
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
                  {isLogin ? (
                    <>
                      <h2 className="font-semibold text-2xl">
                        Login to Get Feedback
                      </h2>
                      <small>Welcome back! Please enter your details.</small>
                      <Login
                        setAlert={setAlert}
                        setAlertMessage={setAlertMessage}
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-2xl">
                        Create an account
                      </h2>
                      <small>Sign up in less than 2 minutes.</small>
                      <SignUp
                        setAlert={setAlert}
                        setAlertMessage={setAlertMessage}
                      />
                    </>
                  )}
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

                  <div className="flex items-center justify-center gap-12">
                    <div className="h-[1px] bg-[rgba(15,6,6,0.2)] rounded-md w-24 m-5"></div>
                    <p className="text-sm text-[rgba(15,6,6,0.2)] m-5">OR</p>
                    <div className="h-[1px] bg-[rgba(15,6,6,0.2)] rounded-md w-24 m-5"></div>
                  </div>
                  {console.log("login google ne")}
                  <motion.div
                    onClick={signInWithGoogleCustom}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center gap-3 bg-[rgba(2566,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(2566,256,256,0.4)] cursor-pointer border border-gray-500"
                  >
                    <FcGoogle className="text-3xl" />
                    <p className="text-xl  ">Sign In With Google</p>
                  </motion.div>

                  {isLogin ? (
                    <p className="text-gray-500 mt-4">
                      {" "}
                      Doesn't have an account?{" "}
                      <Link
                        to={"https://fpt.edu.vn/"}
                        className="font-semibold ml-1 text-blue-500 text-base cursor-pointer"
                      >
                        Contact with FPT edu
                      </Link>
                    </p>
                  ) : (
                    <p className="text-gray-500 mt-4">
                      {" "}
                      Already have an account?{" "}
                      <span
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-semibold ml-1 text-blue-500 text-base cursor-pointer"
                      >
                        Login
                      </span>
                    </p>
                  )}
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

export default Auth;
