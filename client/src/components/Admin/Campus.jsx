import React, { useState, useEffect } from "react";
import { createCampus, getAllCampuses } from "../../api";
import { toast } from "react-toastify";

function Campus() {
  const [campusName, setCampusName] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [campuses, setCampuses] = useState([]);

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
            <li key={index}>
              {campus.campusName} - {campus.tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Campus;
