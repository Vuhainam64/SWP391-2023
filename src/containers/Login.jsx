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
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "@firebase/auth";
import { auth } from "../config/firebase.config";
import { signInWithGoogle } from "../ultils/helpers";
import { fadeInOut } from "../animations";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const createNewUser = async () => {
    if (!agreedToTerms) {
      setAlert(true);
      setAlertMessage("You must agree to the terms and conditions.");
      return;
    }

    if (getEmailValidationStatus) {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        setAlert(true);
        setAlertMessage("Passwords do not match.");
        return;
      }

      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCred) {
          // Set the displayName for the user
          await updateProfile(userCred.user, {
            displayName: name, // Use the 'name' state variable
          });

          // Send email verification
          await sendEmailVerification(userCred.user);

          console.log(userCred);

          // Display a message to the user
          setAlert(true);
          setAlertMessage(
            "Account created successfully. Please check your email for verification."
          );
        }
      } catch (error) {
        // Handle Firebase errors here
        setAlert(true);
        if (error.code === "auth/missing-password") {
          setAlertMessage("Password is required.");
        } else if (error.code === "auth/email-already-in-use") {
          setAlertMessage("Email has already been used.");
        } else {
          setAlertMessage("An error occurred while creating the account.");
        }
        setInterval(() => {
          setAlert(false);
        }, 4000);
      }
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
            setAlertMessage("Invalid Id: User not found");
          } else if (err.message.includes("wrong-password")) {
            setAlert(true);
            setAlertMessage("Password is incorrect");
          } else {
            setAlert(true);
            setAlertMessage("Temporarily disabled due to many failed logins");
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
                      <UserAuthInput
                        label="Name"
                        placeholder="Your name"
                        isPassword={false}
                        setStateFunction={setName}
                        Icon={RxAvatar}
                      />
                      <UserAuthInput
                        label="Email"
                        placeholder="Email"
                        isPassword={false}
                        setStateFunction={setEmail}
                        Icon={FaEnvelope}
                        setGetEmailValidationStatus={
                          setGetEmailValidationStatus
                        }
                      />
                      <UserAuthInput
                        label="Password"
                        placeholder="Your password"
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
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-2xl">
                        Login to Get Feedback
                      </h2>
                      <small>Welcome back! Please enter your details.</small>
                      <UserAuthInput
                        label="Email"
                        placeholder="Email"
                        isPassword={false}
                        setStateFunction={setEmail}
                        Icon={FaEnvelope}
                        setGetEmailValidationStatus={
                          setGetEmailValidationStatus
                        }
                      />
                      <UserAuthInput
                        label="Password"
                        placeholder="Your password"
                        isPassword={true}
                        setStateFunction={setPassword}
                        Icon={MdPassword}
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

                  {isLogin ? (
                    <div className="relative mb-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-500 cursor-pointer w-5 h-5"
                          checked={agreedToTerms}
                          onChange={() => setAgreedToTerms(!agreedToTerms)}
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

                  {isLogin ? (
                    <motion.div
                      onClick={createNewUser}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-full py-3 rounded-xl hover:bg-blue-500 cursor-pointer bg-blue-600"
                    >
                      <p className="text-xl text-white">Create an account</p>
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

                  <div className="flex items-center justify-center gap-12">
                    <div className="h-[1px] bg-[rgba(15,6,6,0.2)] rounded-md w-24 m-5"></div>
                    <p className="text-sm text-[rgba(15,6,6,0.2)] m-5">OR</p>
                    <div className="h-[1px] bg-[rgba(15,6,6,0.2)] rounded-md w-24 m-5"></div>
                  </div>

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

export default Login;
