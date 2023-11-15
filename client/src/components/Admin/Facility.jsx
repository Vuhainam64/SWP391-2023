import React, { useState, useEffect } from "react";
import {
  createFacility,
  getAllCampuses,
  getAllRoomsInCampus,
  getAllFacilityInRoom,
} from "../../api";
import { toast } from "react-toastify";

function Facility() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCampuses() {
      const campusesData = await getAllCampuses();
      if (campusesData) {
        setCampuses(campusesData);
      }
    }
    fetchCampuses();
  }, []);

  const handleCampusChange = async (campusId) => {
    setSelectedCampus(campusId);
    const roomsData = await getAllRoomsInCampus(campusId);
    if (roomsData) {
      setRooms(roomsData);
    } else {
      setRooms([]);
    }
    setFacilities([]); // Reset facilities when campus changes
  };

  const handleRoomChange = async (roomId) => {
    setSelectedRoom(roomId);
    const facilitiesData = await getAllFacilityInRoom(roomId);
    if (facilitiesData) {
      setFacilities(facilitiesData);
    } else {
      setFacilities([]);
    }
  };

  const handleCreateFacility = async () => {
    if (!selectedCampus || !selectedRoom || !facilityName) {
      setMessage("Please select a campus, room, and enter a facility name.");
      toast.warning(
        "Please select a campus, room, and enter a facility name !"
      );
      return;
    }

    try {
      const response = await createFacility(selectedRoom, facilityName);
      if (response) {
        setMessage("Facility created successfully.");
        toast.success("Facility created successfully  ~");
        // Refresh the list of facilities
        handleRoomChange(selectedRoom);
      } else {
        setMessage("Failed to create facility.");
        toast.error("Failed to create facility.");
      }
    } catch (error) {
      setMessage("An error occurred while creating the facility.");
      toast.error("An error occurred while creating the facility.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Create Facility</h1>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Select a Campus
      </label>
      <select
        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
        value={selectedCampus}
        onChange={(e) => handleCampusChange(e.target.value)}
      >
        <option value="">Select a Campus</option>
        {campuses.map((campus) => (
          <option key={campus.campusId} value={campus.campusId}>
            {campus.campusName}
          </option>
        ))}
      </select>
      {rooms.length > 0 && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Select a Room
          </label>
          <select
            className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
            value={selectedRoom}
            onChange={(e) => handleRoomChange(e.target.value)}
          >
            <option value="">Select a Room</option>
            {rooms.map((room) => (
              <option key={room.roomId} value={room.roomId}>
                {room.roomName}
              </option>
            ))}
          </select>
        </div>
      )}
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Facility Name
      </label>
      <input
        type="text"
        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Facility Name"
        value={facilityName}
        onChange={(e) => setFacilityName(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleCreateFacility}
      >
        Create Facility
      </button>
      <p className="text-red-600 text-sm mt-2">{message}</p>

      {/* Display the list of rooms in the selected campus */}
      {facilities.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">
            Facilities in Selected Room
          </h2>
          <ul>
            {facilities.map((facility) => (
              <li key={facility.facilityId}>{facility.facilityName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Facility;
