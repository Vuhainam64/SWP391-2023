import { useState } from "react";
import { Footer, Navbar, UserAuthInput } from "../components";
import { FaEnvelope } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineCheck } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth } from "../config/firebase.config";
import { signInWithGoogle } from "../ultils/helpers";
import { fadeInOut } from "../animations";

function Login() {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const createNewUser = async () => {
    if (getEmailValidationStatus) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const loginWithEmailPassword = async () => {
    if (getEmailValidationStatus) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMessage("Invalid Id : User not found");
          } else if (err.message.includes("wrong-password")) {
            setAlert(true);
            setAlertMessage("Password is incorrect");
          } else {
            setAlert(true);
            setAlertMessage("Temporarity disabled due to many failed login");
          }

          setInterval(() => {
            setAlert(false);
          }, 4000);
        });
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="flex mt-6 mb-10">
          <div
            className={`w-full md:max-w-6xl mx-auto px-4 flex md:flex-row-reverse flex-wrap ${
              isLogin ? "items-center" : ""
            }`}
          >
            <div className="w-full md:w-1/2 md:p-6">
              <div className="border rounded-md p-6 shadow-md sticky top-4">
                <div>
                  {isLogin ? (
                    <>
                      <h2 className="font-semibold text-2xl">
                        Create an account
                      </h2>
                      <small>Sign up in less than 2 minutes.</small>
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-2xl">
                        Login to Get Feedback
                      </h2>
                      <small>Welcome back! Please enter your details.</small>
                    </>
                  )}

                  <div>
                    <div className="mt-4">
                      {isLogin ? (
                        <UserAuthInput
                          lable="Name"
                          placeHolder="Your name"
                          isPass={false}
                          key="Name"
                          setStateFunction={setName}
                          Icon={RxAvatar}
                        />
                      ) : (
                        ""
                      )}
                      {/* email  */}
                      <UserAuthInput
                        lable="Email"
                        placeHolder="Email"
                        isPass={false}
                        key="Email"
                        setStateFunction={setEmail}
                        Icon={FaEnvelope}
                        setGetEmailValidationStatus={
                          setGetEmailValidationStatus
                        }
                      />

                      {/* password */}
                      <UserAuthInput
                        lable="Password"
                        placeHolder="Your password"
                        isPass={true}
                        key="Password"
                        setStateFunction={setPassword}
                        Icon={MdPassword}
                      />

                      {/* confirm password */}
                      {isLogin ? (
                        <UserAuthInput
                          lable="Confirm password"
                          placeHolder="Confirm your password"
                          isPass={true}
                          key="Confirm password"
                          setStateFunction={setConfirmPassword}
                          Icon={MdPassword}
                        />
                      ) : (
                        ""
                      )}

                      {/* alert section  */}
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
                      {/* policy  */}
                      {isLogin ? (
                        <div className="relative mb-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-500 cursor-pointer w-5 h-5"
                            />
                            <label className="text-gray-700 ml-2 text-sm mt-3">
                              I agree with the{" "}
                              <Link
                                to={"/terms-conditions"}
                                className="text-blue-500"
                              >
                                Terms and conditions
                              </Link>{" "}
                              and{" "}
                              <Link
                                to={"/privacy-policy"}
                                className="text-blue-500"
                              >
                                Privacy policy
                              </Link>{" "}
                              of the website and I accept them.
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex items-center my-5">
                          <div className="flex items-center w-full md:w-1/2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-500 cursor-pointer w-3 h-3"
                            />
                            <label className="text-gray-700 ml-2">
                              {" "}
                              Remember Me{" "}
                            </label>
                          </div>
                          <div className="w-full md:w-1/2 text-right">
                            <Link
                              to={"/#"}
                              className="text-xs hover:underline text-gray-500 sm:text-sm hover:text-gray-700"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* login button  */}
                      {isLogin ? (
                        <motion.div
                          onClick={createNewUser}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-blue-500 cursor-pointer bg-blue-600"
                        >
                          <p className="text-xl text-white">
                            Create an account
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          onClick={loginWithEmailPassword}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-blue-500 cursor-pointer bg-blue-600"
                        >
                          <p className="text-xl text-white">Login</p>
                        </motion.div>
                      )}
                      {/* or section  */}
                      <div className="flex items-center justify-center gap-12">
                        <div className="h-[1px] bg-[rgba(15,6,6,0.2)] rounded-md w-24 m-5"></div>
                        <p className="text-sm text-[rgba(15,6,6,0.2)] m-5">
                          OR
                        </p>
                        <div className="h-[1px] bg-[rgba(15,6,6,0.2)] rounded-md w-24 m-5"></div>
                      </div>

                      {/* login with google */}
                      <motion.div
                        onClick={signInWithGoogle}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center gap-3 bg-[rgba(2566,256,256,0.2)] backdrop-blur-md w-full py-3 rounded-xl hover:bg-[rgba(2566,256,256,0.4)] cursor-pointer border border-gray-500"
                      >
                        <FcGoogle className="text-3xl" />
                        <p className="text-xl  ">Sign In With Google</p>
                      </motion.div>

                      {isLogin ? (
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
                      ) : (
                        <p className="text-gray-500 mt-4">
                          {" "}
                          Doesn't have an account?{" "}
                          <span
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-semibold ml-1 text-blue-500 text-base cursor-pointer"
                          >
                            Sign Up
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* left title  */}
            <div className="w-full md:w-1/2 md:p-6 mt-8 md:mt-0">
              <h1 className="font-bold text-3xl">
                {" "}
                Easy to create a feedback - save time for solution{" "}
              </h1>
              <p className="text-gray-900 my-4 text-lg">
                {" "}
                If you have problems about the facilities you can easily send us
                feedback now because it's free free.{" "}
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

export default Login;
