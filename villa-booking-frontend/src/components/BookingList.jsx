import { useEffect, useState } from 'react'
import axios from 'axios'

export function BookingList() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:5000/api/bookings/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setBookings(res.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        alert('Failed to fetch bookings')
      }
    }

    fetchBookings()
  }, [])

  return (
    <div>
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>User Name</th>
              <th style={thStyle}>User Email</th>
              <th style={thStyle}>Villa</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Start Date</th>
              <th style={thStyle}>End Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td style={tdStyle}>{booking.id}</td>
                <td style={tdStyle}>{booking.user_name}</td>
                <td style={tdStyle}>{booking.email}</td>
                <td style={tdStyle}>{booking.villa_name}</td>
                <td style={tdStyle}>{booking.location}</td>
                <td style={tdStyle}>{new Date(booking.start_date).toLocaleDateString()}</td>
                <td style={tdStyle}>{new Date(booking.end_date).toLocaleDateString()}</td>
                <td style={tdStyle}>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
}

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
}
