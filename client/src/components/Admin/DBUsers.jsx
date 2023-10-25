import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setAllUsers } from "../../context/actions/allUsersAction";
import { getAllRolesAPI, getAllUserAPI, updateRole } from "../../api";
import { Pagination } from "../Styles";
import { setAllRoles } from "../../context/actions/allRolesAction";

function DBUsers() {
  const allUsers = useSelector((state) => state?.allUsers?.allUsers);
  const allRoles = useSelector((state) => state?.allRoles?.allRoles);
  const dispatch = useDispatch();

  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verify, setVerify] = useState(false);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [chosenID, setChosenID] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [curentPageShowCourse, setCurentPageShowCourse] = useState([]);
  const [totalItems, setTotalItems] = useState();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userData = await getAllUserAPI();
        dispatch(setAllUsers(userData));
      } catch (error) {
        console.log("Error fetching users:", error);
        dispatch(setAllUsers([]));
      }
    }

    async function fetchRoles() {
      try {
        const rolesData = await getAllRolesAPI();
        dispatch(setAllRoles(rolesData));
        setRoles(rolesData);
      } catch (error) {
        console.log("Error fetching roles:", error);
        dispatch(setAllRoles([]));
      }
    }

    fetchUsers();
    fetchRoles();
  }, [dispatch]);

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

  const updateUser = async () => {
    if (chosenID) {
      const selectedRoleObject = roles.find(
        (role) => role.role_name === selectedRole
      );
      try {
        await updateRole(chosenID, selectedRoleObject?.roleId);
      } catch (error) {
        console.log("Error updating user:", error);
      }
    }
  };

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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const choseItemPerPage = (itemNumber) => {
    setItemsPerPage(itemNumber);
  };
  function chooseID({ user }) {
    if (user) {
      setChosenID(user.uid);
      setName(user.displayName);
      setEmail(user.email);
      setVerify(user.emailVerified);
    }
  }

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
                          value={Name}
                          onChange={(e) => setName(e.target.value)}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                        <select
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                          className="bg-transparent border-b-2 border-gray-300 py-2"
                        >
                          <option value="true">Verify</option>
                          <option value="false">Not Verify</option>
                        </select>
                      ) : (
                        <div className="bg-transparent border-gray-300 py-2 w-full">
                          {user.emailVerified ? "verify" : "not verify"}
                        </div>
                      )}
                    </td>
                    <td className="p-3 px-5 text-center">
                      {chosenID === user.uid ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="bg-transparent border-b-2 border-gray-300 py-2"
                        >
                          {allRoles.map((role) => (
                            <option key={role.id} value={role.role_name}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="bg-transparent border-gray-300 py-2 w-full">
                          {roles.map((role) =>
                            role.roleId === user.roleId ? role.role_name : null
                          )}
                        </div>
                      )}
                    </td>

                    <td>
                      {chosenID === user.uid ? (
                        <div className="p-3 px-5 flex justify-center items-center gap-3">
                          <button
                            type="button"
                            onClick={updateUser}
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
                            onClick={() => chooseID({ user })}
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
