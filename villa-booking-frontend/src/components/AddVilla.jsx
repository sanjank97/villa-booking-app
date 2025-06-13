import { useState } from 'react'
import axios from 'axios'

export function AddVilla() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token') // 👈 get token from localStorage

    try {
      const res = await axios.post(
        'http://localhost:5000/api/villas',
        {
          name,
          location,
          price,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 add Bearer token in header
          },
        }
      )

      alert('Villa added successfully!')
      // Reset form
      setName('')
      setLocation('')
      setPrice('')
      setDescription('')
    } catch (err) {
      console.error('Error adding villa:', err)
      alert('Failed to add villa.')
    }
  }

  return (
    <div>
      <h2>Add New Villa</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Price Per Night</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Add Villa</button>
      </form>
    </div>
  )
}
