import { useEffect, useState } from 'react'
import axios from 'axios'

export function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.data.success) {
          setUsers(response.data.users)
        } else {
          alert('Failed to load users')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        alert('Error fetching users')
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>{new Date(user.created_at).toLocaleString()}</td>
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
