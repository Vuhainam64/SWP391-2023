import React, { useState, useEffect } from "react";
import {
  createRoom,
  getAllCampuses,
  getAllRoomsInCampus,
  updateRoom,
} from "../../api";
import { toast } from "react-toastify";

function Room() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [editRoomId, setEditRoomId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    async function fetchCampuses() {
      const campusesData = await getAllCampuses();
      if (campusesData) {
        setCampuses(campusesData);
      }
    }
    fetchCampuses();
  }, []);

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

  const handleEditRoom = async (roomId) => {
    setShowEditForm(true);
    setEditRoomId(roomId);
    const roomToEdit = rooms.find((room) => room.roomId === roomId);
    if (roomToEdit) {
      setNewRoomName(roomToEdit.roomName);
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Ensure newData is an object
      const newData = { roomName: newRoomName };

      await updateRoom(editRoomId, newData);
      toast.success("Room updated successfully ~");

      // Fetch the updated list of rooms after updating a room
      const roomsInCampus = await getAllRoomsInCampus(selectedCampus);
      if (roomsInCampus) {
        setRooms(roomsInCampus);
      }

      setShowEditForm(false);
      setEditRoomId(null);
      setNewRoomName("");
    } catch (error) {
      toast.error("Failed to update room.");
      console.error("Error updating room:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditRoomId(null);
    setNewRoomName("");
  };
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
              <li
                key={room.roomId}
                className="flex items-center justify-between border-b py-2"
              >
                <span className="text-lg">Room no: {room.roomName}</span>
                <button
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => handleEditRoom(room.roomId)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Edit Room</h2>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            New Room Name
          </label>
          <input
            type="text"
            className="w-full border rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="New Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="flex-grow bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="flex-grow bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;
