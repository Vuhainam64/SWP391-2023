import React, { useState, useEffect } from "react";
import { createUserAPI, getAllRolesAPI } from "../../api";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function CreateUser() {
  const [userRoles, setUserRoles] = useState([{ role: "", email: "" }]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [duplicateEmails, setDuplicateEmails] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getAllRolesAPI();
      if (roles) {
        setAvailableRoles(roles);
      }
    };

    fetchRoles();
  }, []);

  const addRole = () => {
    // Check if either email or role is empty
    if (
      !newRole.trim() ||
      userRoles.some((userRole) => !userRole.email.trim())
    ) {
      // Display an error message or take appropriate action
      console.error("Email and Role cannot be empty");
      return;
    }

    setUserRoles([...userRoles, { role: newRole, email: "" }]);
    setNewRole("");
  };

  const removeRole = (index) => {
    const updatedRoles = [...userRoles];
    updatedRoles.splice(index, 1);
    setUserRoles(updatedRoles);
  };

  const removeRoleByEmail = (email) => {
    const updatedRoles = userRoles.filter((role) => role.email !== email);
    setUserRoles(updatedRoles);
  };

  const handleRoleChange = (index, value) => {
    const updatedRoles = [...userRoles];
    updatedRoles[index].role = value;
    setUserRoles(updatedRoles);
  };

  const handleEmailChange = (index, value) => {
    const updatedRoles = [...userRoles];
    updatedRoles[index].email = value;
    setUserRoles(updatedRoles);
  };

  const handleSubmit = async () => {
    const duplicateEmailList = findDuplicateEmails(
      userRoles.map((ur) => ur.email)
    );
    if (duplicateEmailList.length > 0) {
      setDuplicateEmails(duplicateEmailList);
      return;
    }

    const userData = userRoles.map(({ role, email }) => ({ role, email }));

    try {
      const response = await createUserAPI(userData);

      if (response.success) {
        toast.success("Users created successfully!"); // Hiển thị toast khi thành công
        removeAllRoles(); // Xoá toàn bộ dữ liệu sau khi submit thành công
      } else {
        toast.error(response.msg); // Hiển thị toast khi có lỗi
      }
    } catch (error) {
      toast.error("Error creating users: " + error.message); // Hiển thị toast khi có lỗi
    }
  };

  const findDuplicateEmails = (emailList) => {
    const emailSet = new Set();
    const duplicates = [];

    for (const email of emailList) {
      if (emailSet.has(email)) {
        duplicates.push(email);
      } else {
        emailSet.add(email);
      }
    }

    return duplicates;
  };

  const exportToExcel = () => {
    const data = userRoles.map(({ email, role }) => ({
      Email: email,
      Role: role,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };

  const importFromExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: ["email", "role"],
        defval: "",
      });

      const previewRows = jsonData.slice(1, 6).map(({ email, role }) => ({
        email: email || "",
        role: role || "",
      }));

      setPreviewData(previewRows);

      const importedUsers = jsonData.slice(1).map(({ email, role }) => ({
        email: email || "",
        role: role || "",
      }));

      setUserRoles(importedUsers);

      const duplicateEmailList = findDuplicateEmails(
        importedUsers.map((ur) => ur.email)
      );
      if (duplicateEmailList.length > 0) {
        setDuplicateEmails(duplicateEmailList);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const removeAllRoles = () => {
    setUserRoles([]);
  };

  const removeDuplicateEmails = () => {
    const uniqueRoles = [...userRoles];
    duplicateEmails.forEach((duplicateEmail) => {
      const index = uniqueRoles.findIndex(
        (role) => role.email === duplicateEmail
      );
      if (index !== -1) {
        uniqueRoles.splice(index, 1);
      }
    });
    setUserRoles(uniqueRoles);
    setDuplicateEmails([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-3xl font-bold mb-6">Create User</h1>

      <div className="space-y-4">
        {userRoles.map((userRole, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-1/2">
              <label
                htmlFor={`role-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id={`role-${index}`}
                value={userRole.role}
                onChange={(e) => handleRoleChange(index, e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              >
                <option value="">Select Role</option>
                {availableRoles.map((role) => (
                  <option key={role.roleId} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label
                htmlFor={`email-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id={`email-${index}`}
                value={userRole.email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="Enter email"
                className="mt-1 p-2 border rounded-md w-full"
              />
            </div>

            <button
              onClick={() => removeRole(index)}
              className="mt-8 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 space-x-4">
        <div className="w-1/2">
          <label
            htmlFor="newRole"
            className="block text-sm font-medium text-gray-700"
          >
            New Role
          </label>
          <select
            id="newRole"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          >
            <option value="">Select Role</option>
            {availableRoles.map((role) => (
              <option key={role.roleId} value={role.role_name}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-8 flex w-full justify-between">
          <button
            onClick={addRole}
            className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Role
          </button>
          <button
            onClick={removeAllRoles}
            className="mt-8 bg-red-500 text-white px-4 py-2 rounded-md mr-6"
          >
            Remove All
          </button>
        </div>
        {duplicateEmails.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Duplicate Emails</h2>
            <ul>
              {duplicateEmails.map((email, index) => (
                <li key={index}>
                  {email} -{" "}
                  {userRoles.find((role) => role.email === email)?.role}
                  <button
                    onClick={() => {
                      const updatedDuplicates = [...duplicateEmails];
                      updatedDuplicates.splice(index, 1);
                      setDuplicateEmails(updatedDuplicates);
                      removeRoleByEmail(email);
                    }}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={removeDuplicateEmails}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Remove All Duplicates
            </button>
          </div>
        )}
        <div className="mt-8 space-x-4">
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 text-white px-6 py-3 rounded-md"
          >
            Export Excel
          </button>

          <input
            type="file"
            onChange={importFromExcel}
            className="p-2 border rounded-md"
          />

          <label
            htmlFor="importExcel"
            className="bg-blue-500 text-white px-6 py-3 rounded-md cursor-pointer"
          >
            Import Excel
          </label>
        </div>
        <Link
          to={
            "https://firebasestorage.googleapis.com/v0/b/get-feedback-a0119.appspot.com/o/Images%2Fusers.xlsx?alt=media&token=470c0f1e-613d-4b83-98b4-7d6befe7ccd4"
          }
        >
          Download Template
        </Link>
      </div>
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded-md"
        >
          Submit
        </button>
      </div>
      {previewData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Preview (First 5 Rows)</h2>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map(({ email, role }, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{email}</td>
                  <td className="border px-4 py-2">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CreateUser;
