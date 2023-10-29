import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick } from "../../animations";
import { Logo } from "../../assets";
import { motion } from "framer-motion";
import { createTask, getAllFeedbacks, updateEmployeeStatus } from "../../api";
import { setAllFeedbacks } from "../../context/actions/allFeedbackActions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoReturnDownBackOutline } from "react-icons/io5";

function Task() {
  const allFeedbacks = useSelector(
    (state) => state?.allFeedbacks?.allFeedbacks
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeId } = useParams();
  const [hasFetchedFeedbacks, setHasFetchedFeedbacks] = useState(false);

  useEffect(() => {
    if (!hasFetchedFeedbacks) {
      getAllFeedbacks().then((data) => {
        dispatch(setAllFeedbacks(data));
        setHasFetchedFeedbacks(true);
      });
    }
    console.log("employeeId: ", employeeId);
  }, [dispatch, allFeedbacks, employeeId, hasFetchedFeedbacks]);

  const notVerifiedFeedbacks = allFeedbacks?.filter(
    (item) => item.feedbackstatus?.Status === "Not Verify"
  );

  const handleAssignClick = async (feedbackstatus, feedbackId) => {
    await createTask(employeeId, feedbackstatus, feedbackId);
    await updateEmployeeStatus(employeeId, "Working");
    navigate("/admin/employee");
  };

  return (
    <div className="mt-10">
      <Link to={"/admin/employee"} className="flex items-center">
        <IoReturnDownBackOutline className="mr-4" />
        Return to employee
      </Link>
      {notVerifiedFeedbacks && notVerifiedFeedbacks.length > 0 ? (
        notVerifiedFeedbacks.map((item) => (
          <div className="bg-blue-400 rounded-md" key={item.feedbackId}>
            <div className="flex m-4">
              <motion.img
                alt="feedback"
                src={item.imageURL ? item.imageURL : Logo}
                whileHover={{ scale: 1.1 }}
                className="w-32 h-32 my-4"
              />
              <div className="flex-col ml-10 text-white relative w-full my-4">
                <div>Title: {item.title}</div>
                <div>Location: {item.location}</div>
                <div>Status: {item.feedbackstatus.Status}</div>
                <div>
                  Create At: {new Date(item.createdAt).toLocaleString()}
                </div>
                <div>
                  Last Updated:
                  {new Date(item.feedbackstatus.updatedAt).toLocaleString()}
                </div>
                <div className="absolute bottom-0 right-0 flex">
                  <motion.div
                    {...buttonClick}
                    onClick={() =>
                      handleAssignClick(
                        item.feedbackstatus.Status,
                        item.feedbackId
                      )
                    }
                    className="bg-green-400 px-2 py-1 rounded-md mx-2 cursor-pointer"
                  >
                    Assign
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No feedbacks found.</p>
      )}
    </div>
  );
}

export default Task;
