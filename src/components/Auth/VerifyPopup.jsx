import { Logo } from "../../assets";
import { auth } from "../../config/firebase.config";
import { sendEmailVerification } from "firebase/auth";
import { motion } from "framer-motion";
import { fadeInOut } from "../../animations";
import { useState } from "react";

function VerifyPopup() {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const sendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification email sent.");
        console.log(user);
        setAlert(true);
        setAlertMessage("Verification email sent.");
      } else {
        console.error("No user is currently signed in.");
      }
    } catch (err) {
      if (err.message.includes("too-many-requests")) {
        setAlert(true);
        setAlertMessage("You have send too many request");
      }

      setInterval(() => {
        setAlert(false);
      }, 4000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
      <div className="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
        <h3 className="text-2xl">Thanks for signing up for Get Feedback!</h3>
        <div className="flex justify-center">
          <img src={Logo} alt="logo" className="h-20" />
        </div>
        <p>
          We're happy you're here. If you have not received the email, you can
          press the button below to resend:
        </p>
        <div className="mt-4">
          <button
            onClick={sendVerificationEmail}
            className="px-2 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            Click to Verify Email
          </button>
          {alert && (
            <motion.p
              key={"Alert Message"}
              {...fadeInOut}
              className="text-red-500 text-center"
            >
              {alertMessage}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyPopup;
