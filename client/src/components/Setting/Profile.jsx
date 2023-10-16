import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import UserAuthInput from "../Auth/UserAuthInput";
import { RxAvatar } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../../config/firebase.config";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import Spinner from "../Spinner";
import { buttonClick } from "../../animations";
import { Avatar } from "../../assets";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { SET_USER } from "../../context/actions/userActions";

function Profile() {
  const user = useSelector((state) => state?.user?.user);
  const userId = auth.currentUser?.uid;
  const dispatch = useDispatch();

  const [name, setName] = useState(user.displayName || "");
  const [isLoading, setisLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

  const uploadImage = (e) => {
    setisLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error : ${error}`));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadURL(downloadURL);
          setisLoading(false);
          setProgress(null);
          dispatch(alertSuccess("Image Uploaded to the cloud"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    setisLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);

    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setisLoading(false);
      dispatch(alertSuccess("Image removed from the cloud"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };

  const submitNewData = async () => {
    try {
      if (name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      if (imageDownloadURL) {
        await updateProfile(auth.currentUser, { photoURL: imageDownloadURL });
      }
      await updateDoc(doc(db, "user", userId), {
        displayName: name,
        photoURL: imageDownloadURL,
      });
      dispatch(
        SET_USER({ ...user, displayName: name, photoURL: imageDownloadURL })
      );
      dispatch(alertSuccess("User data updated successfully"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      dispatch(alertDanger(`Error updating user data: ${error}`));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  return (
    <div>
      <p className="font-semibold text-xl text-gray-900">Profile details</p>
      <small>Update your username and manage your account details.</small>
      <div className="flex items-center relative">
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            style={{ display: "none" }}
          />
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly">
              <Spinner />
              {Math.round(progress > 0) && (
                <div className=" w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor pr-3">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.round(progress)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden rounded-md">
              <motion.img
                whileHover={{ scale: 1.15 }}
                src={
                  imageDownloadURL
                    ? imageDownloadURL
                    : user?.photoURL
                    ? user?.photoURL
                    : Avatar
                }
                className="rounded-full my-4 h-32 w-32"
              />
            </div>
          )}
          {imageDownloadURL && (
            <motion.button
              {...buttonClick}
              type="button"
              className="absolute top-1 left-24 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
              onClick={() => deleteImageFromFirebase(imageDownloadURL)}
            >
              <MdDelete className="-rotate-0" />
            </motion.button>
          )}
        </label>
      </div>
      <UserAuthInput
        label="Name"
        placeholder="Your name"
        isPassword={false}
        setStateFunction={setName}
        Icon={RxAvatar}
        values={name}
      />
      <div className="flex mt-4">
        <motion.div
          onClick={submitNewData}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center p-2 rounded-xl hover-bg-blue-700 cursor-pointer bg-blue-600"
        >
          <p className="text-xl text-white">Save changes</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
