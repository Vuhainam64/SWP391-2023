import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth, db } from "../config/firebase.config";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineFeedback, MdOutlineSettings } from "react-icons/md";
import { doc, setDoc } from "firebase/firestore";

const googleProider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProider).then((useCred) => {
    window.location.reload();
  });
};

export const signOutAction = async () => {
  await auth.signOut().then(() => {
    window.location.reload();
  });
};

export const updateUserDocument = async (userCred, userData) => {
  const userRef = doc(db, "user", userCred.uid);
  await setDoc(userRef, userData, { merge: true });
};

export const Menus = [
  {
    id: uuidv4(),
    icon: <MdOutlineFeedback />,
    name: "Feedbacks",
    uri: "/feedback",
  },
  {
    id: uuidv4(),
    icon: <MdOutlineSettings />,
    name: "Settings",
    uri: "/setting/profile",
  },
];
