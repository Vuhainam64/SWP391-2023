import { Link, useNavigate } from "react-router-dom";
import { buttonClick } from "../animations";
import { Footer, Navbar, Spinner } from "../components";
import { motion } from "framer-motion";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { TextEditorBar, modules, formats } from "../components/Styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../components/Styles/Snow.css";
import { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertActions";
import {
  createFeedback,
  getAllCampuses,
  getAllFacilityInRoom,
  getAllRoomsInCampus,
  getFeedbackWithUser,
} from "../api";
import { MdDelete } from "react-icons/md";
import { setFeedback } from "../context/actions/feedbackActions";
import { toast } from "react-toastify";

function CreateFeedback() {
  const user = useSelector((state) => state?.user?.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          toast.success("Image Uploaded to the cloud ~");

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
      toast.success("Image removed from the cloud~");
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };

  const submitFeedback = async () => {
    const userId = user.uid;
    const feedbackData = {
      title,
      content,
      campusId: selectedCampus,
      roomId: selectedRoom,
      facilityId: selectedFacility,
      imageURL: imageDownloadURL,
    };
    const response = await createFeedback(userId, feedbackData);

    if (response) {
      console.log("Feedback created successfully:", response);
      toast.success("Feedback created successfully");
    } else {
      console.error("Failed to create feedback.");
      toast.warning(
        "Cannot provide feedback for the same facility because have a user feedback the same"
      );
    }
    getFeedbackWithUser(user?.uid).then((data) => {
      dispatch(setFeedback(data));
    });
    navigate("/feedback", { replace: true });
  };

  const handleCampusChange = async (campusId) => {
    setSelectedCampus(campusId);
    const roomsData = await getAllRoomsInCampus(campusId);
    if (roomsData) {
      setRooms(roomsData);
    } else {
      setRooms([]);
    }
    setFacilities([]); // Reset facilities when campus changes
  };

  const handleRoomChange = async (roomId) => {
    setSelectedRoom(roomId);
    const facilitiesData = await getAllFacilityInRoom(roomId);
    if (facilitiesData) {
      setFacilities(facilitiesData);
    } else {
      setFacilities([]);
    }
  };

  const handleFacilityChange = async (facilityId) => {
    setSelectedFacility(facilityId);
  };

  useEffect(() => {
    async function fetchCampuses() {
      const campusesData = await getAllCampuses();
      if (campusesData) {
        setCampuses(campusesData);
      }
    }
    fetchCampuses();
  }, []);

  useEffect(() => {
    async function fetchRoomsAndFacilities() {
      const roomsData = await getAllRoomsInCampus(selectedCampus);
      if (roomsData) {
        const sortedRooms = roomsData.sort((roomA, roomB) =>
          roomA.roomName.localeCompare(roomB.roomName)
        );
        setRooms(sortedRooms);
      } else {
        setRooms([]);
      }

      const facilitiesData = await getAllFacilityInRoom(selectedRoom);
      if (facilitiesData) {
        const sortedFacilities = facilitiesData.sort((facilityA, facilityB) =>
          facilityA.facilityName.localeCompare(facilityB.facilityName)
        );
        setFacilities(sortedFacilities);
      } else {
        setFacilities([]);
      }
    }

    fetchRoomsAndFacilities();
  }, [selectedCampus, selectedRoom]);
  return (
    <div className="flex flex-col">
      <Navbar />
      {/* title  */}
      <div className="pt-12 bg-gray-50 sm:pt-16 border-b pb-[250px] relative">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center max-w-4xl gap-8 mx-auto md:gap-12 md:flex-row">
            <div className="aspect-[4/3] shrink-0 rounded-lg shadow-sm overflow-hidden group max-w-xs">
              <img
                src="https://ftmaintenance.com/wp-content/uploads/2020/01/shutterstock_1147700213-600x400.jpg"
                alt="img"
                className="object-cover w-full h-full transition-all duration-200 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 text-center md:text-left relative">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Facitylity Report Form Template
              </h1>
              <div className="mt-2 text-lg font-normal text-gray-600">
                Report and document facitylity incidents easily with our
                Facitylity Report Form template.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4 md:justify-start">
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Audit Forms
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Audit Forms
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  Audit Forms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* content  */}
      <div className="relative px-4 mx-auto sm:px-6 lg:px-8 -mt-[210px]">
        <div className="max-w-7xl">
          <div className="max-w-2xl p-4 mx-auto bg-white shadow-lg sm:p-6 lg:p-8 rounded-xl ring-1 ring-inset ring-gray-200 isolate">
            <div className="text-sm font-medium text-center text-gray-500 -mt-2 mb-2">
              Template Preview
            </div>
            <div className="open-complete-form mb-4 p-4 bg-gray-50 border border-gray-200 border-dashed rounded-lg">
              <h1 className="mb-4 px-2 font-semibold text-2xl">
                Facitylity Report Form
              </h1>
              <div>
                <div className="form-description mb-4 text-gray-700 whitespace-pre-wrap px-2">
                  <div>
                    Please fill out this form to report any facitylity incidents
                    that you have encountered. Your cooperation is greatly
                    appreciated.
                  </div>
                </div>
                <form action="">
                  <div className="relative mb-3">
                    <label className="text-gray-700 font-semibold text-sm">
                      Title
                      <span className="text-red-500 required-dot">*</span>
                    </label>
                    <div className="flex items-center justify-center gap-3 w-full h-full px-4 py-1 rounded-lg border-gray-300 border bg-white">
                      <input
                        type="text"
                        placeholder="Title"
                        className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* campus  */}
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select a Campus
                    <span className="text-red-500 required-dot">*</span>
                  </label>
                  <select
                    className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
                    value={selectedCampus}
                    onChange={(e) => handleCampusChange(e.target.value)}
                  >
                    <option value="">Select a Campus</option>
                    {campuses.map((campus) => (
                      <option key={campus.campusId} value={campus.campusId}>
                        {campus.campusName}
                      </option>
                    ))}
                  </select>

                  {/* select room  */}
                  {rooms.length > 0 && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Select a Room
                        <span className="text-red-500 required-dot">*</span>
                      </label>
                      <select
                        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
                        value={selectedRoom}
                        onChange={(e) => handleRoomChange(e.target.value)}
                      >
                        <option value="">Select a Room</option>
                        {rooms.map((room) => (
                          <option key={room.roomId} value={room.roomId}>
                            {room.roomName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* facility  */}
                  {facilities.length > 0 && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Select a Facility
                        <span className="text-red-500 required-dot">*</span>
                      </label>
                      <select
                        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
                        value={selectedFacility}
                        onChange={(e) => handleFacilityChange(e.target.value)}
                      >
                        <option value="">Select a Facility</option>
                        {facilities.map((facility) => (
                          <option
                            key={facility.facilityId}
                            value={facility.facilityId}
                          >
                            {facility.facilityName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="relative mb-3">
                    <label className="text-gray-700 font-semibold text-sm">
                      Content
                    </label>
                    <div className="p-3 border rounded-xl w-full max-w-[50.5rem] h-fit border-gray-300 bg-white">
                      <TextEditorBar toolbarId={"t1"} className="" />
                      <ReactQuill
                        theme="snow"
                        placeholder={"Write something awesome..."}
                        modules={modules("t1")}
                        formats={formats}
                        className="max-w-[48.5rem] min-h-[12.5rem] h-[12.5rem] max-h-[12.5rem] overflow-auto"
                        value={content}
                        onChange={(value) => setContent(value)}
                      />
                    </div>
                  </div>
                  <div className="relative mb-3">
                    <label className="text-gray-700 font-semibold text-sm">
                      Attach Files
                    </label>

                    <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                      {isLoading ? (
                        <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
                          <Spinner />
                          {Math.round(progress > 0) && (
                            <div className=" w-full flex flex-col items-center justify-center gap-2">
                              <div className="flex justify-between w-full">
                                <span className="text-base font-medium text-textColor">
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
                        <>
                          {!imageDownloadURL ? (
                            <>
                              <label>
                                <div className=" flex flex-col items-center justify-center h-full w-full cursor-pointer">
                                  <div className="flex flex-col justify-center items-center cursor-pointer">
                                    <p className="font-bold text-4xl">
                                      <AiOutlineCloudUpload className="-rotate-0" />
                                    </p>
                                    <p className="text-lg text-textColor">
                                      Click to upload an image
                                    </p>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  name="upload-image"
                                  accept="image/*"
                                  onChange={uploadImage}
                                  className=" w-0 h-0"
                                />
                              </label>
                            </>
                          ) : (
                            <>
                              <div className="relative w-full h-full overflow-hidden rounded-md">
                                <motion.img
                                  whileHover={{ scale: 1.15 }}
                                  src={imageDownloadURL}
                                  className=" w-full h-full object-cover"
                                />

                                <motion.button
                                  {...buttonClick}
                                  type="button"
                                  className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                                  onClick={() =>
                                    deleteImageFromFirebase(imageDownloadURL)
                                  }
                                >
                                  <MdDelete className="-rotate-0" />
                                </motion.button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center w-full">
                    <motion.div
                      {...buttonClick}
                      onClick={submitFeedback}
                      className="px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-600 font-semibold shadow-md cursor-pointer"
                    >
                      Submit
                    </motion.div>
                  </div>
                </form>
                <div className="text-center w-full mt-2">
                  <Link
                    to={"/home"}
                    className="text-gray-400 hover:text-gray-500 cursor-pointer hover:underline text-xs"
                  >
                    Powered by
                    <span className="font-semibold mx-1">Get Feedback</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-12 bg-white sm:pb-16">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-2xl mx-auto mt-16 space-y-12 sm:mt-16 sm:space-y-16">
              <div className="space-y-5">
                <h2 className="text-gray-400 font-semibold uppercase">
                  Introduction
                </h2>
                <div>
                  This form is designed for reporting facitylity incidents. It
                  provides a structured way to collect necessary information
                  regarding any security breaches or incidents that have
                  occurred.
                </div>
                <h2 className="text-gray-400 font-semibold uppercase">
                  Purpose
                </h2>
                <div>
                  This form is designed for reporting facitylity incidents. It
                  provides a structured way to collect necessary information
                  regarding any security breaches or incidents that have
                  occurred.
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

export default CreateFeedback;
