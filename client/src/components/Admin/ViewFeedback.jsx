import { useDispatch, useSelector } from "react-redux";
import { buttonClick } from "../../animations";
import { Logo } from "../../assets";
import { motion } from "framer-motion";
import { getAllFeedbacks, updateFeedbackStatus } from "../../api";
import { setAllFeedbacks } from "../../context/actions/allFeedbackActions";
import { useEffect } from "react";

function ViewFeedback() {
  const allFeedbacks = useSelector(
    (state) => state?.allFeedbacks?.allFeedbacks
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!allFeedbacks) {
      getAllFeedbacks().then((data) => {
        dispatch(setAllFeedbacks(data));
      });
    }
  }, [dispatch, allFeedbacks]);

  const notVerifiedFeedbacks = allFeedbacks?.filter(
    (item) => item.status?.Status === "Not Verify"
  );

  const acceptFeedback = async (statusId) => {
    try {
      const verifyFeedback = await updateFeedbackStatus(statusId);
      if (verifyFeedback) {
        console.log(
          "Trạng thái của feedback cập nhật thành công:",
          verifyFeedback
        );
        getAllFeedbacks().then((data) => {
          dispatch(setAllFeedbacks(data));
        });
      } else {
        console.error("Lỗi khi cập nhật feedback của người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API cập nhật feedback của người dùng:", error);
    }
  };

  return (
    <div className="mt-10">
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
                <div>
                  Create At: {new Date(item.createdAt).toLocaleString()}
                </div>
                <div>
                  Last Updated:
                  {new Date(item.status.updatedAt).toLocaleString()}
                </div>
                <div className="absolute bottom-0 right-0 flex">
                  <motion.div
                    {...buttonClick}
                    onClick={() => acceptFeedback(item.statusId)}
                    className="bg-green-400 px-2 py-1 rounded-md mx-2 cursor-pointer"
                  >
                    Accept
                  </motion.div>
                  <motion.div
                    {...buttonClick}
                    className="bg-red-400 px-2 py-1 rounded-md mx-2 cursor-pointer"
                  >
                    Reject
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

export default ViewFeedback;
