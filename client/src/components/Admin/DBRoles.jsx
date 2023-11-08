import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRolesAPI } from "../../api";
import { setAllRoles } from "../../context/actions/allRolesAction";

import { AiOutlineDelete, AiTwotoneEdit } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import Spinner from "../Spinner";

export default function DBRoles() {
  const allRoles = useSelector((state) => state?.allRoles?.allRoles);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const rolesData = await getAllRolesAPI();
        setLoading(false);
        dispatch(setAllRoles(rolesData));
      } catch (error) {
        console.log("Error fetching roles:", error);
        dispatch(setAllRoles([]));
      }
    }
    fetchRoles();
  }, [dispatch]);
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
            <h1 className="text-3xl">Roles</h1>
            <button className="flex border-blue-900 border-2 rounded-lg bg-blue-500 text-blue-50 py-1 px-4 hover:bg-blue-700 transition-colors duration-300 focus:outline-none">
              <IoMdAddCircleOutline className="text-2xl" />
              Add new role
            </button>
          </div>
          <div className="px-3 py-4 flex justify-center text-xl ">
            <table className="table-auto w-full border-collapse">
              <thead className="text-white h-10 px-5 py-1 bg-gray-700">
                <tr>
                  <th className="w-[20%] border-2 rounded-tl-lg hover:text-2xl">
                    <div className="h-full pl-5 items-center whitespace-nowrap">
                      <label className="font-bold">#</label>
                    </div>
                  </th>
                  <th className="w-[40%] border-2 hover:text-2xl">
                    <div className="h-full pl-5 items-center whitespace-nowrap">
                      <label className="font-bold">Role Name</label>
                    </div>
                  </th>
                  <th className="w-[40%] border-1 rounded-tr-lg hover:text-2xl">
                    <div className="h-full pl-5 items-center whitespace-nowrap">
                      <label className="font-bold">Operations</label>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allRoles.map((role, index) => (
                  <tr
                    className="border-b hover:bg-orange-100 bg-white shadow-lg text-center"
                    key={index}
                  >
                    <td className="text-gray-700 font-medium">{index + 1}</td>
                    <td className="text-gray-700">
                      {role.role_name.toUpperCase()}
                    </td>
                    <td>
                      <button className="mr-2 focus:outline-none">
                        <AiTwotoneEdit className="text-gray-500 hover:text-gray-700" />
                      </button>
                      <button className="focus:outline-none">
                        <AiOutlineDelete className="text-red-500 hover:text-red-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
