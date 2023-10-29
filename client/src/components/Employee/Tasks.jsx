import { BsEyeFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAllTasks } from "../../context/actions/allTasksActions";
import { getAllTaskOfEmployee } from "../../api";
import { useEffect } from "react";

function Tasks() {
  const allTasks = useSelector((state) => state?.allTasks?.allTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allTasks) {
      getAllTaskOfEmployee().then((data) => {
        dispatch(setAllTasks(data));
      });
    }
  }, [dispatch, allTasks]);

  return (
    <div>
      <div className="mt-10 text-gray-900 flex items-center justify-between">
        <h1 className="text-3xl">Tasks</h1>
      </div>

      <div className="px-3 py-4">
        <table className="table-auto w-full border-collapse">
          <thead className="text-white h-10 px-5 py-1 bg-gray-700">
            <tr>
              <th className="border-2 rounded-tl-lg">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">#</label>
                </div>
              </th>
              <th className="border-2">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Task name</label>
                </div>
              </th>
              <th className="border-2">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Delivered on</label>
                </div>
              </th>
              <th className="border-2">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Details</label>
                </div>
              </th>
              <th className="border-2">
                <div className="h-full pl-5 items-center whitespace-nowrap">
                  <label className="font-bold">Status</label>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {allTasks &&
              allTasks.map((task, index) => (
                <tr
                  key={task.taskId}
                  className="border-b hover:bg-orange-100 bg-white shadow-lg text-center"
                >
                  <td className="text-gray-700 font-medium">{index + 1}</td>
                  <td className="text-gray-700">{task.description}</td>
                  <td className="text-gray-700">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-gray-700">
                    <button className="rounded-lg border-2 bg-blue-500 text-blue-50 items-center p-2">
                      <Link to={`/employee/tasks/${task.feedbackId}`}>
                        <BsEyeFill className="text-xl" />
                      </Link>
                    </button>
                  </td>
                  <td className="text-gray-700">{task.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tasks;
