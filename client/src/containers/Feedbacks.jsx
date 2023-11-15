import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setFeedback } from "../context/actions/feedbackActions";
import { useEffect, useState } from "react";
import { getFeedbackWithUser } from "../api";

function Feedbacks() {
  const user = useSelector((state) => state?.user?.user);
  const feedback = useSelector((state) => state?.feedback?.feedback);

  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!feedback) {
      getFeedbackWithUser(user?.uid).then((data) => {
        dispatch(setFeedback(data));
      });
    }
  }, [dispatch, feedback, user?.uid]);

  function handleInputChange(e) {
    setSearchInput(e.target.value);
  }

  const filteredFeedbacks = feedback
    ? feedback.filter((item) =>
        item.title.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex bg-gray-50 pb-5">
        <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl p-4">
          <div className="pt-4 pb-0">
            <div className="flex">
              <h2 className="flex-grow text-gray-900 text-2xl font-semibold">
                Your Feedbacks
              </h2>
              <Link
                to={"/create-feedback"}
                className="v-btn py-2 px-4
        bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200
        text-white transition ease-in duration-200 text-center text-base font-medium focus:outline-none focus:ring-2
        focus:ring-offset-2 rounded-lg flex items-center hover:no-underline"
              >
                <span className="no-underline mx-auto flex items-center">
                  <AiOutlinePlus className="mr-2 text-xl" />
                  Create a new feedback
                </span>
              </Link>
            </div>
            <small className="flex text-gray-500">
              Manage your feedbacks and submissions.
            </small>
          </div>
        </div>
      </div>
      <div className="flex bg-white">
        <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl px-4">
          <div className="mt-8 pb-0">
            <div className="mb-6 relative">
              <div className="text-gray-700 font-semibold text-sm">
                Search a feedback
              </div>
              <div className="flex items-center justify-center gap-3 w-full h-full px-4 rounded-md border-gray-300 border bg-white">
                <input
                  type="text"
                  placeholder="Name of feedback to search"
                  value={searchInput}
                  onChange={handleInputChange}
                  className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-sm"
                />
              </div>
              {/* my form  */}
              <div className="mb-10">
                {filteredFeedbacks && filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((item) => (
                    <div key={item.feedbackId}>
                      <div className="mt-4 p-4 flex group bg-white hover:bg-gray-50">
                        <div className="flex-grow items-center truncate cursor-pointer">
                          <span className="font-semibold text-gray-900">
                            {item.title}
                          </span>
                          <div className="flex items-center justify-between">
                            <ul className="flex text-gray-500">
                              <li className="pr-1">Status</li>
                              <li className="list-disc ml-6 pr-1">
                                {item.status.Status}
                              </li>
                              <li className="list-disc ml-6">
                                Created:{" "}
                                {new Date(item.createdAt).toLocaleString()}
                              </li>
                            </ul>
                            <div className="border border-gray-300 hover:bg-gray-200 px-3 py-2 rounded-lg">
                              <BsThreeDots />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* not feedback  */}
                    <div className="flex bg-white">
                      <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl px-4">
                        <div className="mt-8 pb-0">
                          <div className="flex flex-wrap justify-center max-w-4xl">
                            <img
                              src="https://d3ietpyl4f2d18.cloudfront.net/0c5c10e0-8bac-4312-b450-2ec2495f6035/img/pages/forms/search_notfound.png"
                              alt="cloud"
                              className="w-56"
                            />
                            <h3 className="w-full mt-4 text-center text-gray-900 font-semibold">
                              No feedback found
                            </h3>
                            <Link
                              to={"/create-feedback"}
                              className="py-2 px-4
                              bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200
                              text-white transition ease-in duration-200 text-center text-base font-medium focus:outline-none focus:ring-2
                                focus:ring-offset-2 rounded-lg flex items-center hover:no-underline"
                            >
                              <span className="no-underline mx-auto flex items-center">
                                <AiOutlinePlus className="mr-2 text-xl" />
                                Create a new feedback
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Feedbacks;
