import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Myaccount() {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to view your bookings')
      return navigate('/login')
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBookings(res.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        toast.error('Failed to load your bookings')
      }
    }

    fetchBookings()
  }, [navigate])

  const today = new Date().toISOString().split('T')[0]

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.end_date).toISOString().split('T')[0] >= today
  )

  const completedBookings = bookings.filter(
    (b) => new Date(b.end_date).toISOString().split('T')[0] < today
  )

  const renderBookings = (bookingList) => (
    <ul className="space-y-6">
      {bookingList.map((booking) => (
        <li
          key={booking.id}
          className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
        >
          <h2 className="text-xl font-semibold text-blue-700">{booking.villa_name}</h2>
          <p className="text-gray-700">
            <strong>Location:</strong> {booking.location}
          </p>
          <p className="text-gray-700">
            <strong>Start Date:</strong>{' '}
            {new Date(booking.start_date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>End Date:</strong>{' '}
            {new Date(booking.end_date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Status:</strong> {booking.status}
          </p>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {activeTab === 'upcoming' && (
        <>
          {upcomingBookings.length === 0 ? (
            <p className="text-gray-600">You have no upcoming bookings.</p>
          ) : (
            renderBookings(upcomingBookings)
          )}
        </>
      )}

      {activeTab === 'completed' && (
        <>
          {completedBookings.length === 0 ? (
            <p className="text-gray-600">You have no completed bookings.</p>
          ) : (
            renderBookings(completedBookings)
          )}
        </>
      )}
    </div>
  )
}
