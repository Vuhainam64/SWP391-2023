import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

function Tasks() {
  return (
    <div>
      <div className="mt-10 text-gray-900 flex items-center justify-between">
        <h1 className="text-3xl">Tasks</h1>
      </div>

      <div className="px-3 py-4 flex justify-center text-xl ">
        <table className="table-auto w-full border-collapse">
          <thead className="text-white h-10 px-5 py-1 bg-gray-700">
            <tr>
              <th className="border-2 rounded-tl-lg hover:text-2xl">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">#</label>
                </div>
              </th>
              <th className="border-2 hover:text-2xl">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Task name</label>
                </div>
              </th>
              <th className="border-2 hover:text-2xl">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Delivered on</label>
                </div>
              </th>
              <th className="border-2 hover:text-2xl">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Delivered by</label>
                </div>
              </th>
              <th className="border-2 hover:text-2xl">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Details</label>
                </div>
              </th>
              <th className="border-2 hover:text-2xl">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Status</label>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-orange-100 bg-white shadow-lg text-center">
              <td className="text-gray-700 font-medium">taskId</td>
              <td className="text-gray-700">name of task</td>
              <td className="text-gray-700">task's created date</td>
              <td className="text-gray-700">admin</td>
              <td className="text-gray-700">
                <button className="rounded-lg border-2 bg-blue-500 text-blue-50 items-center p-2">
                  <Link to='id'>
                  <BsEyeFill className="text-xl"/>
                  </Link>
                </button>
              </td>
              <td className="text-gray-700">Viewing/Demand fixing/Done</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tasks;