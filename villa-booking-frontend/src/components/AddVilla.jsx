import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

export function AddVilla() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')



const handleSubmit = async (e) => {
  e.preventDefault()

  const token = localStorage.getItem('token')

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
          Authorization: `Bearer ${token}`,
        },
      }
    )

    toast.success('✅ Villa added successfully!')

    // Reset form
    setName('')
    setLocation('')
    setPrice('')
    setDescription('')
  } catch (err) {
    console.error('Error adding villa:', err)
    toast.error(
      err?.response?.data?.message || '❌ Failed to add villa.'
    )
  }
}


return (
  <div className="p-6 max-w-xl mx-auto bg-white rounded-md shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Villa</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Add Villa
      </button>
    </form>
  </div>
)

}
