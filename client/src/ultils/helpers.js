import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { v4 as uuidv4 } from "uuid";
import { CgProfile } from "react-icons/cg";
import { RiFeedbackLine } from "react-icons/ri";

const googleProider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProider).then((useCred) => {
    window.location.reload();
  });
};

export const Menus = [
  {
    id: uuidv4(),
    icon: <RiFeedbackLine />,
    name: "Feedbacks",
    uri: "/feedback",
  },
  {
    id: uuidv4(),
    icon: <CgProfile />,
    name: "Settings",
    uri: "/setting/profile",
  },
];

export const signOutAction = async () => {
  await auth.signOut().then(() => {
    window.location.reload();
  });
};
