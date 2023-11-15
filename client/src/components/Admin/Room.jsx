import React, { useState, useEffect } from "react";
import { createRoom, getAllCampuses, getAllRoomsInCampus } from "../../api";
import { toast } from "react-toastify";

function Room() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchCampuses() {
      const campusesData = await getAllCampuses();
      if (campusesData) {
        setCampuses(campusesData);
      }
    }
    fetchCampuses();
  }, []);

  const handleCreateRoom = async () => {
    if (!selectedCampus || !roomName) {
      setMessage("Please select a campus and enter a room name.");
      toast.warning("Please select a campus and enter a room name !");
      return;
    }

    try {
      const response = await createRoom(selectedCampus, roomName);
      if (response) {
        setMessage("Room created successfully.");
        toast.success("Room created successfully ~");
        // After creating the room, fetch the updated list of rooms in the selected campus
        const roomsInCampus = await getAllRoomsInCampus(selectedCampus);
        if (roomsInCampus) {
          setRooms(roomsInCampus);
        }
      } else {
        setMessage("Failed to create room.");
        toast.error("Failed to create room.");
      }
    } catch (error) {
      setMessage("An error occurred while creating the room.");
      toast.error("An error occurred while creating the room.");
    }
  };

  // Load rooms for the selected campus on initial load or when selectedCampus changes
  useEffect(() => {
    async function fetchRoomsInCampus() {
      if (selectedCampus) {
        const roomsInCampus = await getAllRoomsInCampus(selectedCampus);
        if (roomsInCampus) {
          setRooms(roomsInCampus);
        }
      }
    }
    fetchRoomsInCampus();
  }, [selectedCampus]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Create Room</h1>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Select a Campus
      </label>
      <select
        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
        value={selectedCampus}
        onChange={(e) => setSelectedCampus(e.target.value)}
      >
        <option value="">Select a Campus</option>
        {campuses.map((campus) => (
          <option key={campus.campusId} value={campus.campusId}>
            {campus.campusName}
          </option>
        ))}
      </select>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Room Name
      </label>
      <input
        type="text"
        className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
      <p className="text-red-600 text-sm mt-2">{message}</p>

      {/* Display the list of rooms in the selected campus */}
      {rooms.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">
            Rooms in {selectedCampus}
          </h2>
          <ul>
            {rooms.map((room) => (
              <li key={room.roomId}>Lớp học số: {room.roomName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Room;
