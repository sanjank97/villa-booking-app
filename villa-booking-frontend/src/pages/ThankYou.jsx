import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ThankYou() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingDetails(res.data);
      } catch (error) {
        console.error('Failed to load booking details:', error);
      }
    };

    if (bookingId) {
      fetchDetails();
    }
  }, [bookingId]);

  if (!bookingDetails) {
    return <div className="text-center py-10 text-gray-500">Loading booking info...</div>;
  }

  const {
    booking_id,
    start_date,
    end_date,
    status,
    created_at,
    villa_name,
    villa_location,
    price_per_night,
    user_name,
    user_email,
    paid_amount,
    payment_id,
    order_id,
  } = bookingDetails;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank You for Your Booking!</h1>
      <p className="mb-6 text-gray-700">Your booking has been confirmed. Below are your complete booking and payment details:</p>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200">

        {/* User Info */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">👤 Guest Details</h2>
          <p><strong>Name:</strong> {user_name}</p>
          <p><strong>Email:</strong> {user_email}</p>
        </div>

        {/* Villa Info */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">🏡 Villa Details</h2>
          <p><strong>Name:</strong> {villa_name}</p>
          <p><strong>Location:</strong> {villa_location}</p>
          <p><strong>Price per Night:</strong> ₹{price_per_night}</p>
        </div>

        {/* Booking Info */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">📅 Booking Info</h2>
          <p><strong>Booking ID:</strong> {booking_id}</p>
          <p><strong>Check In:</strong> {new Date(start_date).toLocaleDateString()}</p>
          <p><strong>Check Out :</strong> { new Date(end_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Booked On:</strong> {new Date(created_at).toLocaleString()}</p>
        </div>

        {/* Payment Info */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">💳 Payment Info</h2>
          <p><strong>Amount Paid:</strong> ₹{paid_amount}</p>
          <p><strong>Payment ID:</strong> {payment_id}</p>
          <p><strong>Order ID:</strong> {order_id}</p>
        </div>
      </div>
    </div>
  );
}
