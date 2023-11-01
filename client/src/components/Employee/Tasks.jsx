import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAllTasks } from "../../context/actions/allTasksActions";
import { getAllTaskOfEmployee } from "../../api";
import { useEffect, useState } from "react";

function Tasks() {
  const allTasks = useSelector((state) => state?.allTasks?.allTasks);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (!allTasks) {
      getAllTaskOfEmployee().then((data) => {
        dispatch(setAllTasks(data));
        setFilteredTasks(data); // Khởi tạo kết quả tìm kiếm ban đầu
      });
    } else {
      setFilteredTasks(allTasks); // Khởi tạo kết quả tìm kiếm ban đầu khi allTasks thay đổi
    }
  }, [dispatch, allTasks]);

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    // Sử dụng searchText để lọc danh sách công việc và cập nhật filteredTasks
    const filtered = allTasks.filter((task) => {
      return (
        task.description.toLowerCase().includes(searchText.toLowerCase()) ||
        task.status.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setFilteredTasks(filtered);
  };

  return (
    <div>
      <div className="mt-10 text-gray-900 flex items-center justify-between">
        <h1 className="text-3xl">Tasks</h1>
      </div>

      <div className="px-3 py-4">
        <div className="mt-5 mb-5">
          <input
            type="text"
            placeholder="Search by task name or status"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-1 rounded-md border border-gray-400"
          />
          <button
            className="px-3 py-1 bg-blue-500 text-white ml-2 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

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
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
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
                    {task.status === "Canceled" ? (
                      <>
                        <button className="rounded-lg border-2 bg-gray-500 text-blue-50 items-center p-2 cursor-none">
                          <div>
                            <BsFillEyeSlashFill className="text-xl" />
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="rounded-lg border-2 bg-blue-500 text-blue-50 items-center p-2">
                          <Link to={`/employee/tasks/${task.feedbackId}`}>
                            <BsEyeFill className="text-xl" />
                          </Link>
                        </button>
                      </>
                    )}
                  </td>
                  <td className="text-gray-700">{task.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No matching tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tasks;
