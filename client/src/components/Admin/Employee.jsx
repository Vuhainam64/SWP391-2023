import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEmployeesWithStatus } from "../../api";
import { Pagination } from "../Styles";
import { setAllEmployee } from "../../context/actions/allEmployeeActions";
import { useNavigate } from "react-router-dom";

function Employee() {
  const allEmployee = useSelector((state) => state?.allEmployee?.allEmployee);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [curentPageShowCourse, setCurentPageShowCourse] = useState([]);
  const [totalItems, setTotalItems] = useState();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userData = await getAllEmployeesWithStatus();
        dispatch(setAllEmployee(userData));
      } catch (error) {
        console.log("Error fetching users:", error);
        dispatch(setAllEmployee([]));
      }
    }
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    if (allEmployee) {
      setTotalItems(allEmployee.length);
      setCurentPageShowCourse([]);
      const firstItem = currentPage * itemsPerPage - itemsPerPage;
      if (firstItem >= allEmployee.length) return;
      let index = 0;
      allEmployee.length - firstItem > itemsPerPage
        ? (index = itemsPerPage)
        : (index = allEmployee.length - firstItem);
      for (let i = 0; i < index; i++) {
        setCurentPageShowCourse((curentPageShowCourse) => [
          ...curentPageShowCourse,
          allEmployee[firstItem + i],
        ]);
      }
    }
  }, [currentPage, itemsPerPage, allEmployee]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const choseItemPerPage = (itemNumber) => {
    setItemsPerPage(itemNumber);
  };

  return (
    <div>
      <div className="text-gray-900">
        <div className="p-4 flex">
          <h1 className="text-3xl">Employee</h1>
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
                    <label>Status</label>
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
                      <div className="bg-transparent border-gray-300 py-2 w-full">
                        {user.displayName}
                      </div>
                    </td>
                    <td className="p-3 px-5">
                      <div className="bg-transparent border-gray-300 py-2 w-full">
                        {user.email}
                      </div>
                    </td>
                    <td className="p-3 px-5">
                      <div className="bg-transparent border-gray-300 py-2 w-full">
                        {user.status.status}
                      </div>
                    </td>
                    <td>
                      <div className="p-3 px-5 flex justify-center items-center">
                        <button
                          onClick={() => navigate(`/admin/task/${user.uid}`)}
                          type="button"
                          className="w-[40%] text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        >
                          Task
                        </button>
                      </div>
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

export default Employee;
