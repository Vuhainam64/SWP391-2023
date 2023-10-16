import { Link } from "react-router-dom";
import { buttonClick } from "../animations";
import { Footer, Navbar } from "../components";
import { motion } from "framer-motion";
import { AiOutlineCloudUpload } from "react-icons/ai";

function CreateFeedback() {
  return (
    <div className="flex flex-col">
      <Navbar />
      {/* title  */}
      <div className="pt-12 bg-gray-50 sm:pt-16 border-b pb-[250px] relative">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center max-w-4xl gap-8 mx-auto md:gap-12 md:flex-row">
            <div className="aspect-[4/3] shrink-0 rounded-lg shadow-sm overflow-hidden group max-w-xs">
              <img
                src="https://images.unsplash.com/photo-1555399784-17946f55db19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MjIwOTV8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwaW5jaWRlbnR8ZW58MHx8fHwxNjk0MTkyMDI0fDA&ixlib=rb-4.0.3&q=80&w=600"
                alt="img"
                className="object-cover w-full h-full transition-all duration-200 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 text-center md:text-left relative">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Cybersecurity Incident Report Form Template
              </h1>
              <p className="mt-2 text-lg font-normal text-gray-600">
                Report and document cybersecurity incidents easily with our
                Cybersecurity Incident Report Form template.
              </p>
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
            <p className="text-sm font-medium text-center text-gray-500 -mt-2 mb-2">
              Template Preview
            </p>
            <div className="open-complete-form mb-4 p-4 bg-gray-50 border border-gray-200 border-dashed rounded-lg">
              <h1 className="mb-4 px-2 font-semibold text-2xl">
                Cybersecurity Incident Report Form
              </h1>
              <div>
                <p className="form-description mb-4 text-gray-700 whitespace-pre-wrap px-2">
                  <p>
                    Please fill out this form to report any cybersecurity
                    incidents that you have encountered. Your cooperation is
                    greatly appreciated.
                  </p>
                </p>
                <form action="">
                  <div className="relative mb-3">
                    <label
                      htmlFor=""
                      className="text-gray-700 font-semibold text-sm"
                    >
                      Location
                      <span className="text-red-500 required-dot">*</span>
                    </label>
                    <div className="flex items-center justify-center gap-3 w-full h-full px-4 py-1 rounded-lg border-gray-300 border bg-white">
                      <input
                        type="text"
                        placeholder="dsadasads"
                        className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
                      />
                    </div>
                  </div>
                  <div className="relative mb-3">
                    <label
                      htmlFor=""
                      className="text-gray-700 font-semibold text-sm"
                    >
                      Location
                      <span className="text-red-500 required-dot">*</span>
                    </label>
                    <div className="flex items-center justify-center gap-3 w-full h-full px-4 py-1 rounded-lg border-gray-300 border bg-white">
                      <input
                        type="text"
                        placeholder="dsadasads"
                        className="flex-1 w-full h-full py-2 outline-none border-none bg-transparent text-text555 text-lg"
                      />
                    </div>
                  </div>
                  <div className="relative mb-3">
                    <label
                      htmlFor=""
                      className="text-gray-700 font-semibold text-sm"
                    >
                      Attach Files
                    </label>

                    <div class="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-5"
                      >
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <AiOutlineCloudUpload className="text-2xl" />
                          <p class="mb-2 text-sm text-gray-500">
                            <span class="font-semibold">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p class="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input id="dropzone-file" type="file" class="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center w-full">
                    <motion.div
                      {...buttonClick}
                      className="px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-600 font-semibold shadow-md cursor-pointer"
                    >
                      Submit
                    </motion.div>
                  </div>
                </form>
                <p className="text-center w-full mt-2">
                  <Link
                    to={"/home"}
                    className="text-gray-400 hover:text-gray-500 cursor-pointer hover:underline text-xs"
                  >
                    Powered by
                    <span className="font-semibold mx-1">Get Feedback</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 translate-y-full inset-x-0">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl -mt-[20px]">
            <div className="flex items-center justify-center">
              <motion.div
                {...buttonClick}
                className="mx-auto w-full max-w-[300px] py-2 px-4
                bg-blue-600 rounded-md text-white text-center cursor-pointer"
              >
                Use this template
              </motion.div>
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
                <p>
                  This form is designed for reporting cybersecurity incidents.
                  It provides a structured way to collect necessary information
                  regarding any security breaches or incidents that have
                  occurred.
                </p>
                <h2 className="text-gray-400 font-semibold uppercase">
                  Purpose
                </h2>
                <p>
                  This form is designed for reporting cybersecurity incidents.
                  It provides a structured way to collect necessary information
                  regarding any security breaches or incidents that have
                  occurred.
                </p>
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
