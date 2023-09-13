import { Link } from "react-router-dom";
import { Logo } from "../assets";

function Navbar() {
  return (
    <>
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to={"/home"}
                className="flex-shrink-0 font-semibold hover:no-underline flex items-center router-link-active"
              >
                <img src={Logo} alt="Logo" className="w-8 h-8" />
                <span className="ml-2 text-md hidden sm:inline text-black ">
                  {" "}
                  Get Feedback
                </span>
              </Link>
            </div>
            <div className="hidden md:block ml-auto relative">
              <Link
                to={"/templates"}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer mt-1 mr-8"
              >
                {" "}
                Templates{" "}
              </Link>
              <Link
                to={"/help"}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer mt-1"
              >
                Help
              </Link>
            </div>
            <div className="hidden md:block pl-5 border-gray-300 border-r h-5"></div>
            <div className="block">
              <div className="flex items-center">
                <div className="ml-3 mr-4 relative">
                  <div className="relative inline-block text-left">
                    <div className="flex gap-2">
                      <Link
                        to={"/auth"}
                        className="text-gray-600 hover:text-gray-800 px-0 sm:px-3 py-2 rounded-md text-sm"
                      >
                        {" "}
                        Login{" "}
                      </Link>
                      <Link
                        to={"/createfeedback"}
                        className="v-btn py-1 px-2
                      bg-transparent border border-blue-600 hover:bg-blue-600 focus:ring-blue-500 focus:ring-offset-blue-200
                      text-blue-600 hover:text-white transition ease-in duration-200 text-center text-sm font-medium focus:outline-none focus:ring-2
                      focus:ring-offset-2 rounded-lg flex items-center hover:no-underline"
                      >
                        <span className="no-underline mx-auto">
                          Create a feedback
                          <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 w-3 h-3 inline"
                          >
                            <path
                              d="M1 11L11 1M11 1H1M11 1V11"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full md:w-4/5 lg:w-3/5 md:mx-auto md:max-w-4xl px-4"></div>
    </>
  );
}

export default Navbar;
