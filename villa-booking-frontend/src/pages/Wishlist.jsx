import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { removeFromWishlist } from '../services/wishlistService';

export default function Wishlist() {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await axios.get('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const villaIds = wishlistRes.data.map(item => item.villa_id);

        const villaRequests = villaIds.map(id =>
          axios.get(`http://localhost:5000/api/villas/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const villaResponses = await Promise.all(villaRequests);
        const villaData = villaResponses.map(res => res.data[0]);
        setVillas(villaData);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleBookNow = (villa) => {
    navigate('/booking-form', { state: { villa } });
  };

  const handleRemove = async (villaId) => {
    try {
      await removeFromWishlist(villaId);
      // Remove from UI after successful removal
      setVillas(prev => prev.filter(v => v.id !== villaId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) return <div className="p-4">Loading wishlist...</div>;

  if (villas.length === 0) return <div className="p-4">No Wishlist Data</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {villas.map((villa) => (
        <div key={villa.id} className="p-4 border rounded shadow relative">
          <h2 className="text-lg font-semibold">{villa.name}</h2>
          <p className="text-gray-600 mb-2">{villa.location}</p>
          <p className="text-sm text-gray-700 mb-4">{villa.description.slice(0, 120)}...</p>
          <p className="text-blue-600 font-medium mb-2">₹{villa.price_per_night} / night</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleBookNow(villa)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
            <button
              onClick={() => handleRemove(villa.id)}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
