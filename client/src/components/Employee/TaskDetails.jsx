import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  feedbackHandle,
  getAllTaskOfEmployee,
  getFeedbackWithId,
} from "../../api";
import { setTaskDetails } from "../../context/actions/taskDetailsActions";
import { Logo } from "../../assets";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { setAllTasks } from "../../context/actions/allTasksActions";

export default function TaskDetails() {
  const taskDetails = useSelector((state) => state?.taskDetails);
  const { feedbackId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskDetails) {
      getFeedbackWithId(feedbackId).then((data) => {
        dispatch(setTaskDetails(data));
      });
    }
  }, [dispatch, feedbackId, taskDetails]);

  const handleCommitment = (employeeComment) => {
    feedbackHandle(feedbackId, employeeComment);
    getAllTaskOfEmployee().then((data) => {
      dispatch(setAllTasks(data));
    });
    navigate("/employee/tasks");
  };
  return (
    <div>
      <Link to={"/employee/tasks"} className="flex items-center mt-8">
        <IoReturnDownBackOutline className="mr-4" />
        Return to task
      </Link>
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
                <div className="grid grid-cols-6 p-5 hover:bg-blue-300">
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
                <div className="grid grid-cols-6 p-5 hover:bg-blue-300">
                  <div className="col-span-2 font-semibold">Location:</div>
                  <div className="col-span-4 text-left">
                    {taskDetails.location}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover:bg-green-300">
                  <div className="col-span-2 font-semibold">
                    Current status:
                  </div>
                  <div className="col-span-4 text-left">
                    {taskDetails.feedbackstatus.Status}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover:bg-blue-300">
                  <div className="col-span-2 font-semibold">Update At:</div>
                  <div className="col-span-4 text-left">
                    {new Date(
                      taskDetails.feedbackstatus.updatedAt
                    ).toLocaleDateString()}
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
                <button
                  onClick={() => handleCommitment("check done")}
                  className="rounded-full p-2 m-2 bg-blue-400"
                >
                  I have checked and {taskDetails.feedbackstatus.Status}
                </button>
                <button
                  onClick={() => handleCommitment("check not")}
                  className="rounded-full p-2 m-2 bg-red-400"
                >
                  {/* check not  */}I have checked but couldn't{" "}
                  {taskDetails.feedbackstatus.Status}
                </button>
                <button
                  onClick={() => handleCommitment("nothing")}
                  className="rounded-full p-2 m-2 bg-purple-400"
                >
                  {/* nothing  */}I have checked and there is nothing to be{" "}
                  {taskDetails.feedbackstatus.Status}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
