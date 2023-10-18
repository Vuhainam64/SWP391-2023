import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers, setAllUsers } from "../../context/actions/allUsersAction";
import { getAllUser } from "../../api";
import { Pagination } from "../Styles";

function DBUsers() {
  const allUsers = useSelector((state) => state?.allUsers?.allUsers);
  const dispatch = useDispatch();
  const [chosenID, setChosenID] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [curentPageShowCourse, setCurentPageShowCourse] = useState([]);
  const [totalItems, setTotalItems] = useState();

  useEffect(() => {
    async function fetchUsers() {
      dispatch(getAllUsers());

      if (!allUsers) {
        dispatch(getAllUsers());

        try {
          const data = await getAllUser();
          dispatch(setAllUsers(data));
          console.log(data);
        } catch (error) {
          console.log("Error fetching users:", error);
          dispatch(setAllUsers([]));
        }
      }
    }

    fetchUsers();
  }, [allUsers, dispatch]); // Add allUsers and dispatch as dependencies

  useEffect(() => {
    if (allUsers) {
      setTotalItems(allUsers.length);
      setCurentPageShowCourse([]);
      const firstItem = currentPage * itemsPerPage - itemsPerPage;
      if (firstItem >= allUsers.length) return;
      let index = 0;
      allUsers.length - firstItem > itemsPerPage
        ? (index = itemsPerPage)
        : (index = allUsers.length - firstItem);
      for (let i = 0; i < index; i++) {
        setCurentPageShowCourse((curentPageShowCourse) => [
          ...curentPageShowCourse,
          allUsers[firstItem + i],
        ]);
      }
    }
  }, [currentPage, itemsPerPage, allUsers]);

  // Số lượng mục trên mỗi trang
  // Tổng số mục bạn muốn phân trang

  const paginate = (pageNumber) => {
    console.log(pageNumber);
    setCurrentPage(pageNumber);
    // Thực hiện logic lấy dữ liệu cho trang mới
    // Ví dụ: fetchData(pageNumber);
  };

  const choseItemPerPage = (itemNumber) => {
    setItemsPerPage(itemNumber);
  };

  return (
    <div>
      <div className="text-gray-900">
        <div className="p-4 flex">
          <h1 className="text-3xl">Users</h1>
        </div>
        <div className="px-3 py-4 flex justify-center ">
          <table className="table-auto w-full border-collapse">
            <thead className="text-white h-10 px-5 py-1 bg-gray-700">
              <tr className="text-left">
                <th className="w-[20%] rounded-tl-lg">
                  <div className="h-full pl-5 items-center whitespace-nowrap">
                    <label>Name</label>
                  </div>
                </th>
                <th className="w-[20%] ">
                  <div className="h-full pl-5 whitespace-nowrap">
                    <label>Email</label>
                  </div>
                </th>
                <th className="w-[20%] ">
                  <div className="h-full pl-5 whitespace-nowrap">
                    <label>Verify</label>
                  </div>
                </th>
                <th className="w-[20%] ">
                  <div className="h-full text-center whitespace-nowrap">
                    <label>Role</label>
                  </div>
                </th>
                <th className="w-[20%] rounded-tr-lg">
                  <div className="h-full text-center whitespace-nowrap">
                    <label>Edit</label>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {curentPageShowCourse &&
                curentPageShowCourse.map((user, index) => (
                  <tr
                    className="border-b hover:bg-orange-100 bg-white shadow-lg"
                    key={index}
                  >
                    <td className="p-3 px-5">
                      {chosenID === user.uid ? (
                        <input
                          type="text"
                          value={user.displayName}
                          className="bg-transparent border-b-2 border-gray-300 py-2 w-full"
                        />
                      ) : (
                        <div className="bg-transparent border-gray-300 py-2 w-full">
                          {user.displayName}
                        </div>
                      )}
                    </td>
                    <td className="p-3 px-5">
                      {chosenID === user.uid ? (
                        <input
                          type="text"
                          value={user.email}
                          className="bg-transparent border-b-2 border-gray-300 py-2 w-full"
                        />
                      ) : (
                        <div className="bg-transparent border-gray-300 py-2 w-full">
                          {user.email}
                        </div>
                      )}
                    </td>
                    <td className="p-3 px-5">
                      {chosenID === user.uid ? (
                        <input
                          type="text"
                          value={user.emailVerified}
                          className="bg-transparent border-b-2 border-gray-300 py-2 w-full"
                        />
                      ) : (
                        <div className="bg-transparent border-gray-300 py-2 w-full">
                          {user.emailVerified ? "verify" : "not verify"}
                        </div>
                      )}
                    </td>
                    <td className="p-3 px-5 text-center">
                      {chosenID === user.uid ? (
                        <select
                          value={user.role ? 1 : 0}
                          className="bg-transparent border-b-2 border-gray-300 py-2"
                        >
                          <option value="0">Admin</option>
                          <option value="1">User</option>
                        </select>
                      ) : (
                        <div className="bg-transparent border-gray-300 py-2">
                          {user.role === 0 ? "Admin" : "User"}
                        </div>
                      )}
                    </td>
                    <td>
                      {chosenID === user.uid ? (
                        <div className="p-3 px-5 flex justify-center items-center gap-3">
                          <button
                            type="button"
                            className="w-[40%] text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="w-[40%] text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="w-[40%] text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => setChosenID(0)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 px-5 flex justify-center items-center">
                          <button
                            type="button"
                            className="w-[40%] text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => setChosenID(user.uid)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="w-full p-5">
          {totalItems && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              paginate={paginate}
              choseItemPerPage={choseItemPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DBUsers;
