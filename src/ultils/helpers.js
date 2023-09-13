import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { v4 as uuidv4 } from "uuid";

const googleProider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProider).then((useCred) => {
    window.location.reload();
  });
};

export const Menus = [
  { id: uuidv4(), name: "My Feedbacks", uri: "/feedback" },
  { id: uuidv4(), name: "Settings", uri: "/setting" },
];

export const signOutAction = async () => {
  await auth.signOut().then(() => {
    window.location.reload();
  });
};
