import React, { useState, useEffect } from "react";
import { createCampus, getAllCampuses, updateCampus } from "../../api";
import { toast } from "react-toastify";

function Campus() {
  const [campusName, setCampusName] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [editCampusId, setEditCampusId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    campusName: "",
    tag: "",
  });

  useEffect(() => {
    // Fetch all campuses when the component mounts
    async function fetchCampuses() {
      const campusesData = await getAllCampuses();
      if (campusesData) {
        setCampuses(campusesData);
      }
    }

    fetchCampuses();
  }, []);

  const handleCreateCampus = async () => {
    if (!campusName || !tag) {
      toast.warning("Campus name and tag are required !");
      setMessage("Campus name and tag are required.");
      return;
    }

    try {
      // Call the createCampus function to create a new campus
      const response = await createCampus(campusName, tag);
      if (response) {
        setMessage("Campus created successfully.");
        toast.success("Campus created successfully ~");

        // Fetch the updated list of campuses after creating a new campus
        const campusesData = await getAllCampuses();
        if (campusesData) {
          setCampuses(campusesData);
        }
      } else {
        setMessage("Failed to create campus.");
        toast.error("Failed to create campus.");
      }
    } catch (error) {
      setMessage("An error occurred while creating the campus.");
      toast.error("An error occurred while creating the campus.");
    }
  };

  const handleEditCampus = (campusId) => {
    // Find the campus data based on campusId
    const campusToEdit = campuses.find(
      (campus) => campus.campusId === campusId
    );

    // Set the edit form data
    setEditFormData({
      campusName: campusToEdit.campusName,
      tag: campusToEdit.tag,
    });

    // Set the edit campusId
    setEditCampusId(campusId);
  };

  const handleUpdateCampus = async () => {
    try {
      await updateCampus(editCampusId, editFormData);
      toast.success("Campus updated successfully ~");

      // Fetch the updated list of campuses after updating a campus
      const campusesData = await getAllCampuses();
      if (campusesData) {
        setCampuses(campusesData);
      }

      // Clear the edit form data and campusId
      setEditFormData({
        campusName: "",
        tag: "",
      });
      setEditCampusId(null);
    } catch (error) {
      toast.error("Failed to update campus.");
      console.error("Error updating campus:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Create Campus</h1>
      <input
        type="text"
        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Campus Name"
        value={campusName}
        onChange={(e) => setCampusName(e.target.value)}
      />
      <input
        type="text"
        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleCreateCampus}
      >
        Create Campus
      </button>

      <p className="text-red-600 text-sm mt-2">{message}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">All Campuses</h2>
        <ul>
          {campuses.map((campus, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-2 border-b"
            >
              <div className="flex items-center">
                <div className="mr-2">{campus.campusName}</div>
                <div className="text-gray-500">- {campus.tag}</div>
              </div>
              <button
                onClick={() => handleEditCampus(campus.campusId)}
                className="text-blue-500 hover:text-blue-700 focus:outline-none focus:text-blue-700"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Form */}
      {editCampusId !== null && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Edit Campus</h2>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Campus Name
          </label>
          <input
            type="text"
            className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Campus Name"
            value={editFormData.campusName}
            onChange={(e) =>
              setEditFormData({ ...editFormData, campusName: e.target.value })
            }
          />
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Tag
          </label>
          <input
            type="text"
            className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Tag"
            value={editFormData.tag}
            onChange={(e) =>
              setEditFormData({ ...editFormData, tag: e.target.value })
            }
          />
          <button
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleUpdateCampus}
          >
            Update Campus
          </button>
        </div>
      )}
    </div>
  );
}

export default Campus;
