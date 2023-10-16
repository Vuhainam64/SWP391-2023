import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUsers, setAllUsers } from "../../context/actions/allUsersAction";
import { getAllUser } from "../../api";

function DBUsers() {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

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

  return (
    <div>
      <div className="text-gray-900 bg-gray-200">
        <div className="p-4 flex">
          <h1 className="text-3xl">Users</h1>
        </div>
        <div className="px-3 py-4 flex justify-center">
          <table className="w-full text-md bg-white shadow-md rounded mb-4">
            <tbody>
              <tr className="border-b">
                <th className="text-left p-3 px-5">Name</th>
                <th className="text-left p-3 px-5">Email</th>
                <th className="text-left p-3 px-5">Role</th>
                <th></th>
              </tr>
              <tr className="border-b hover:bg-orange-100 bg-gray-100">
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.name"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.email"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    value="user.role"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-orange-100">
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.name"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                    alt=""
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.email"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    value="user.role"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-orange-100">
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.name"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                    alt=""
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.email"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    value="user.role"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-orange-100">
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.name"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                    alt=""
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.email"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    value="user.role"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-orange-100">
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.name"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                    alt=""
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.email"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    value="user.role"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-orange-100">
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.name"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                    alt=""
                  />
                </td>
                <td className="p-3 px-5">
                  <input
                    type="text"
                    value="user.email"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  />
                </td>
                <td className="p-3 px-5">
                  <select
                    value="user.role"
                    className="bg-transparent border-b-2 border-gray-300 py-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 px-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DBUsers;
