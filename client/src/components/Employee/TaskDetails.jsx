import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getFeedbackWithId } from "../../api";
import { setTaskDetails } from "../../context/actions/taskDetailsActions";
import { Logo } from "../../assets";

export default function TaskDetails() {
  const taskDetails = useSelector((state) => state?.taskDetails);
  const { feedbackId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!taskDetails) {
      getFeedbackWithId(feedbackId).then((data) => {
        dispatch(setTaskDetails(data));
      });
    }
  }, [dispatch, feedbackId, taskDetails]);

  return (
    <div>
      <div className="mt-10 text-gray-900 text-center">
        <h1 className="font-bold font-mono text-3xl mb-10">Task's Details</h1>
        {taskDetails && (
          <div className="">
            <div className="rounded-lg border border-black grid grid-cols-3">
              <div className="text-2xl font-bold bg-orange-400 text-blue-500 col-span-3">
                Feedback details:
              </div>
              <div className="col-span-1">
                <img
                  src={taskDetails.imageURL || Logo}
                  className="m-4 object-cover"
                  alt="Feedback"
                />
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-6 p-5 hover:bg-green-300">
                  <div className="col-span-2 font-semibold">Title:</div>
                  <div className="col-span-4 text-left">
                    {taskDetails.title}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover-bg-blue-300">
                  <div className="col-span-2 font-semibold">Received on:</div>
                  <div className="col-span-4 text-left">
                    {new Date(taskDetails.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover:bg-green-300">
                  <div className="col-span-2 font-semibold">Description:</div>
                  <div className="col-span-4 text-left">
                    {taskDetails.content}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover-bg-blue-300">
                  <div className="col-span-2 font-semibold">Location:</div>
                  <div className="col-span-4 text-left">
                    {taskDetails.location}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover-bg-green-300">
                  <div className="col-span-2 font-semibold">
                    Current status:
                  </div>
                  <div className="col-span-4 text-left">
                    {taskDetails.feedbackstatus.Status}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover-bg-blue-300">
                  <div className="col-span-2 font-semibold">
                    Admin notes (if any):
                  </div>
                  <div className="col-span-4 text-left">
                    {taskDetails.feedbackstatus.updatedAt}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 bg-green-300 rounded-full border border-black">
              Task delivery:
              <div className="font-bold text-xl">
                Admin has assigned to you for checking/fixing
              </div>
              <div className="font-semibold text-lg">
                {new Date(taskDetails.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-3">
                <div className="col-span-3 font-bold text-3xl">
                  Your commitment:
                </div>
                <button className="rounded-full p-2 m-2 bg-blue-400">
                  I have checked and fixed it
                </button>
                <button className="rounded-full p-2 m-2 bg-red-400">
                  I have checked but couldn't fix it
                </button>
                <button className="rounded-full p-2 m-2 bg-purple-400">
                  I have checked and there is nothing to be fixed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
