import { Link } from "react-router-dom";
import { BackgroundPattern, ViewFeedBack } from "../assets";
import { Footer, Navbar } from "../components";
import { AiOutlineCheck } from "react-icons/ai";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import { IoAnalyticsSharp } from "react-icons/io5";

function Home() {
  return (
    <div className="main-layout min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <section className="bg-gradient-to-b relative from-white to-gray-100 py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="absolute inset-0">
            <img
              src={BackgroundPattern}
              alt="Background"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative -mb-32 md:-mb-52 lg:-mb-72">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight">
                Easy to create{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  {" "}
                  a feedback
                </span>
              </h1>
              <p className="mt-4 sm:mt-5 text-base leading-7 sm:text-xl sm:leading-9 font-medium text-gray-500">
                If you have problems about the facilities you can easily send us
                feedback now <span className="font-bold">it's free</span>
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to={"/createfeedback"}
                  className="mr-1 v-btn py-2 px-4
                  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200
                  text-white transition ease-in duration-200 text-center text-base font-medium focus:outline-none focus:ring-2
                  focus:ring-offset-2 rounded-lg flex items-center hover:no-underline"
                >
                  <span className="no-underline mx-auto">
                    Create a feedback NOW{" "}
                  </span>
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
                </Link>
              </div>
              <div className="justify-center flex gap-2 mt-10">
                <div className="flex items-center text-gray-400 text-sm">
                  <AiOutlineCheck className=" text-blue-600" />{" "}
                  <span>Unlimited forms</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <AiOutlineCheck className=" text-blue-600" />{" "}
                  <span> Unlimited fields </span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <AiOutlineCheck className=" text-blue-600" />{" "}
                  <span>Unlimited responses</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-8 relative px-6 mx-auto max-w-4xl sm:px-10 lg:px-0 z-10 flex items-center justify-center">
              <img
                src={ViewFeedBack}
                alt="cover-product"
                className="w-full shadow-2xl rounded-xl block max-w-2xl lg:max-w-5xl"
              />
            </div>
          </div>
        </section>
        <div className="flex flex-col bg-gray-50 ">
          <div className="bg-white  pt-32 md:pt-52 lg:pt-72 pb-8">
            <div className="md:max-w-5xl md:mx-auto w-full">
              <div className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 pb-8">
                <div className="mb-16 max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
                  <h2 className="mb-6 font-sans text-4xl font-semibold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                    The easiest way to create feedbacks. <br /> And it's{" "}
                    <span className="text-blue-600">100% free!</span>
                  </h2>
                  <p className="text-base text-gray-700 md:text-lg">
                    Need a contact form? Doing a survey? Create a form in 2
                    minutes and start receiving submissions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center mt-16">
                  <div className="w-full md:w-1/2 lg:w-5/12 md:pr-4">
                    <FaRegPenToSquare className="text-blue-600 text-4xl" />
                    <h4 className="my-5 text-2xl font-medium">1. Create</h4>
                    <p className="text-base">
                      {" "}
                      Create a form in 2 minutes. More than 10 input types,
                      images, logic and much more.{" "}
                    </p>
                    <div className="mb-8">
                      <div className="flex mt-4 items-center">
                        <AiOutlineCheck className="text-blue-600 mr-4" /> Build
                        a simple form in minutes.
                      </div>
                    </div>
                    <div className="mb-8">
                      <div className="flex mt-4 items-center">
                        <AiOutlineCheck className="text-blue-600 mr-4" /> No
                        coding needed.
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center relative md:pl-8">
                    <img
                      src="https://d3ietpyl4f2d18.cloudfront.net/be21649b-d7c6-4fb3-a5d9-b393e86f6dd2/img/pages/welcome/step-1.jpg"
                      alt="cover-product"
                      className="block rounded-2xl w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center mt-16 md:flex-row-reverse">
                  <div className="w-full md:w-1/2 lg:w-5/12 md:pl-4">
                    <FiShare2 className="text-blue-600 text-4xl" />
                    <h4 className="my-5 text-2xl font-medium">2. Share</h4>
                    <p className="text-base">
                      {" "}
                      Your form has a unique link that you can share everywhere.
                      Send the link, or even embed the form on your website.{" "}
                    </p>
                    <div className="mb-8">
                      <div className="flex mt-4 items-center">
                        <AiOutlineCheck className="text-blue-600 mr-4" /> Share
                        the link to your form
                      </div>
                      <div className="flex mt-4 items-center">
                        <AiOutlineCheck className="text-blue-600 mr-4" /> Embed
                        the form on your website
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center relative md:pr-8">
                    <img
                      src="https://d3ietpyl4f2d18.cloudfront.net/be21649b-d7c6-4fb3-a5d9-b393e86f6dd2/img/pages/welcome/step-2.jpg"
                      alt="cover-product"
                      className="block rounded-2xl w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center mt-16">
                  <div className="w-full md:w-1/2 lg:w-5/12 md:pr-4">
                    <IoAnalyticsSharp className="text-blue-600 text-4xl" />
                    <h4 className="my-5 text-2xl font-medium">
                      3. Get Results
                    </h4>
                    <p className="text-base">
                      Receive your form submissions. Receive notifications, send
                      confirmations. Export submissions and check your form
                      analytics.
                    </p>
                    <div className="mb-8">
                      <div className="flex mt-4 items-center">
                        <AiOutlineCheck className="text-blue-600 mr-4" /> Build
                        a simple form in minutes.
                      </div>
                    </div>
                    <div className="mb-8">
                      <div className="flex mt-4 items-center">
                        <AiOutlineCheck className="text-blue-600 mr-4" /> No
                        coding needed.
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center relative md:pl-8">
                    <img
                      src="https://d3ietpyl4f2d18.cloudfront.net/be21649b-d7c6-4fb3-a5d9-b393e86f6dd2/img/pages/welcome/step-1.jpg"
                      alt="cover-product"
                      className="block rounded-2xl w-full"
                    />
                  </div>
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

export default Home;
