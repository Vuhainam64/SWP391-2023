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

  // Thêm useEffect để tự động cập nhật taskDetails khi feedbackId thay đổi
  useEffect(() => {
    if (!taskDetails || taskDetails.feedbackId !== feedbackId) {
      // Lấy dữ liệu taskDetails nếu taskDetails chưa tồn tại hoặc feedbackId đã thay đổi
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
                  className="w-80 m-4 object-cover"
                  alt="Feedback"
                />
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-6 p-5 hover-bg-green-300">
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
                <div className="grid grid-cols-6 p-5 hover-bg-green-300">
                  <div className="col-span-2 font-semibold">Description:</div>
                  <div
                    className="col-span-4 text-left"
                    dangerouslySetInnerHTML={{ __html: taskDetails.content }}
                  ></div>
                </div>
                <hr />
                <div className="grid grid-cols-6 p-5 hover-bg-blue-300">
                  <div className="col-span-2 font-semibold">Location:</div>
                  <div className="col-span-4 text-left">
                    {taskDetails.campusName} - Room no: {taskDetails.roomName} -{" "}
                    {taskDetails.facilityName}
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
                {taskDetails.feedbackstatus.Status === "Processing" && (
                  <>
                    <div className="col-span-6 font-bold text-3xl">
                      Your commitment:
                    </div>
                    <button
                      onClick={() => handleCommitment("fixed")}
                      className="rounded-full p-2 m-2 bg-blue-400"
                    >
                      I had fixed it
                    </button>
                    <button
                      onClick={() => handleCommitment("not fixed")}
                      className="rounded-full p-2 m-2 bg-purple-400"
                    >
                      I can't fix it
                    </button>
                  </>
                )}
                {taskDetails.feedbackstatus.Status === "Validating" && (
                  <>
                    <div className="col-span-6 font-bold text-3xl">
                      Your commitment:
                    </div>
                    <button
                      onClick={() => handleCommitment("verify")}
                      className="rounded-full p-2 m-2 bg-blue-400"
                    >
                      I had verify it
                    </button>
                    <button
                      onClick={() => handleCommitment("reject")}
                      className="rounded-full p-2 m-2 bg-purple-400"
                    >
                      Reject Feedback
                    </button>
                    <button
                      onClick={() => handleCommitment("cancel")}
                      className="rounded-full p-2 m-2 bg-yellow-300"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
