import React, { useState, useEffect } from "react";
import {
  createFacility,
  getAllCampuses,
  getAllRoomsInCampus,
  getAllFacilityInRoom,
  updateFacility,
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
  const [editFacilityId, setEditFacilityId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState("");

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
      const sortedRooms = roomsData.sort((roomA, roomB) =>
        roomA.roomName.localeCompare(roomB.roomName)
      );
      setRooms(sortedRooms);
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

  const handleEditFacility = (facilityId) => {
    setShowEditForm(true);
    setEditFacilityId(facilityId);
    const facilityToEdit = facilities.find(
      (facility) => facility.facilityId === facilityId
    );
    if (facilityToEdit) {
      setNewFacilityName(facilityToEdit.facilityName);
    }
  };

  const handleSaveFacilityEdit = async () => {
    try {
      await updateFacility(editFacilityId, { facilityName: newFacilityName });
      toast.success("Facility updated successfully ~");

      // Fetch the updated list of facilities after updating a facility
      handleRoomChange(selectedRoom);

      setShowEditForm(false);
      setEditFacilityId(null);
      setNewFacilityName("");
    } catch (error) {
      toast.error("Failed to update facility.");
      console.error("Error updating facility:", error);
    }
  };

  const handleCancelFacilityEdit = () => {
    setShowEditForm(false);
    setEditFacilityId(null);
    setNewFacilityName("");
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
              <li
                key={facility.facilityId}
                className="flex items-center justify-between border-b py-2"
              >
                <span className="text-lg">{facility.facilityName}</span>
                <button
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => handleEditFacility(facility.facilityId)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Facility Form */}
      {showEditForm && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Edit Facility</h2>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            New Facility Name
          </label>
          <input
            type="text"
            className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="New Facility Name"
            value={newFacilityName}
            onChange={(e) => setNewFacilityName(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="flex-grow bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              onClick={handleSaveFacilityEdit}
            >
              Save
            </button>
            <button
              className="flex-grow bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              onClick={handleCancelFacilityEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Facility;
