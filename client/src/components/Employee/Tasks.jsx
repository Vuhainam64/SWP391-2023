import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAllTasks } from "../../context/actions/allTasksActions";
import { getAllTaskOfEmployee } from "../../api";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";

function Tasks() {
  const allTasks = useSelector((state) => state?.allTasks?.allTasks);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statusOptions = ["All", "Canceled", "Verified", "Fixed", "Pending"];

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getAllTaskOfEmployee();
        setLoading(false);
        dispatch(setAllTasks(data));
        setFilteredTasks(data); // Khởi tạo kết quả tìm kiếm ban đầu
      } catch (error) {
        console.log("Error fetching users:", error);
        dispatch(setAllTasks([]));
      }
    }
    fetchTasks();
  }, [dispatch]);

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = allTasks.filter((task) => {
      return (
        (selectedStatus === "All" || task.taskData.status === selectedStatus) &&
        (task.facilityName.toLowerCase().includes(searchText.toLowerCase()) ||
          task.taskData.status.toLowerCase().includes(searchText.toLowerCase()))
      );
    });

    setFilteredTasks(filtered);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    handleSearch(); // Gọi hàm handleSearch để lọc lại dữ liệu khi chọn trạng thái mới
  };

  return (
    <>
      {loading ? (
        <>
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        </>
      ) : (
        <>
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
            <div className="mt-5 mb-5 flex">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1 bg-blue-500 text-white ml-2 rounded-md ${
                    selectedStatus === status ? "bg-blue-700" : ""
                  }`}
                  onClick={() => handleStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
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
                      <label className="font-bold">Facility</label>
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
                      <td className="text-gray-700">{task.facilityName}</td>
                      <td className="text-gray-700">
                        {new Date(task.taskData.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-gray-700">
                        {task.taskData.status === "Canceled" ? (
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
                              <Link
                                to={`/employee/tasks/${task.taskData.feedbackId}`}
                              >
                                <BsEyeFill className="text-xl" />
                              </Link>
                            </button>
                          </>
                        )}
                      </td>
                      <td className="text-gray-700">{task.taskData.status}</td>
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
        </>
      )}
    </>
  );
}

export default Tasks;
