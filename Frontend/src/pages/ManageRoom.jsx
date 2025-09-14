// src/pages/ManageRoom.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ManageRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoom(response.data);
            } catch (err) {
                setError("Failed to load room details.");
                console.error("Error fetching room:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleUpdate = () => {
        navigate(`/update-room/${roomId}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate(-1); // Go back to previous page
            } catch (err) {
                setError("Failed to delete room.");
                console.error("Error deleting room:", err);
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading room details...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!room) return <div className="text-center p-8">Room not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Room #{room.roomId}</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold">Room Size:</h3>
                        <p>{room.roomSize} sqft</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Bed Type:</h3>
                        <p>{room.bedType}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Max Capacity:</h3>
                        <p>{room.maxPeople} people</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">AC:</h3>
                        <p>{room.isAC ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Base Fare:</h3>
                        <p>${room.baseFare}/night</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleUpdate}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Update Room
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete Room
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Rooms
                    </button>
                </div>
            </div>
        </div>
    );
}