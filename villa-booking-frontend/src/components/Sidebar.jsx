import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className="sidebar" style={{ width: '200px', background: '#f4f4f4', padding: '20px', height: '100vh' }}>
      <h3>Admin Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><NavLink to="villas">Villas</NavLink></li>
        <li><NavLink to="add-villa">Add Villa</NavLink></li>
        <li><NavLink to="users">Users</NavLink></li>
        <li><NavLink to="bookings">Bookings</NavLink></li>
      </ul>
    </div>
  )
}
