import { AiOutlineSearch } from "react-icons/ai";
import { Footer, Navbar } from "../components";
import { FaChevronDown } from "react-icons/fa6";

function Templates() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-full border-t flex-grow">
        <div className="py-12 sm:py-16 bg-gray-50 border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Feedback Templates
              </h1>
              <p className="text-gray-600 mt-4 text-lg font-normal">
                Our collection of templates to create your own feedback!
              </p>
            </div>
          </div>

          <div className="bg-white py-12 sm:py-16">
            {/* search  */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <form>
                <div className="flex">
                  <button
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
                    type="button"
                  >
                    All categories
                    <FaChevronDown className="ml-3" />
                  </button>
                  <div className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ">
                    <ul className="py-2 text-sm text-gray-700 ">
                      <li>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                        >
                          Mockups
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100 "
                        >
                          Templates
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                        >
                          Design
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                        >
                          Logos
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="relative w-full">
                    <input
                      type="search"
                      className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search Mockups, Logos, Design Templates..."
                      required
                    />
                    <button
                      type="submit"
                      className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                      <AiOutlineSearch className="font-semibold text-lg" />
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* item list  */}
            <div className="relative z-10 p-4">
              <div className="flex flex-wrap justify-center">
              <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
                  <img
                    className="w-full"
                    src="https://v1.tailwindcss.com/img/card-top.jpg"
                    alt="Sunset in the mountains"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">
                      The Coldest Sunset
                    </div>
                    <p className="text-gray-700 text-base">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Voluptatibus quia, nulla! Maiores et perferendis eaque,
                      exercitationem praesentium nihil.
                    </p>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      #photography
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      #travel
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      #winter
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Templates;
