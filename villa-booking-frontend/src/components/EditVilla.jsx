import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export function EditVilla() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch existing villa details
  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/villas/${id}`)
        const villa = response.data[0] // because your API returns an array

        setName(villa.name)
        setLocation(villa.location)
        setPrice(villa.price_per_night)
        setDescription(villa.description)
        setLoading(false)
      } catch (error) {
        toast.error('❌ Failed to load villa details')
        setLoading(false)
      }
    }

    fetchVilla()
  }, [id])

 const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const token = localStorage.getItem('token') // Get token from localStorage

    await axios.put(
      `http://localhost:5000/api/villas/${id}`,
      {
        name,
        location,
        price,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    toast.success('✅ Villa updated successfully!')
    setTimeout(() => navigate('/admin/dashboard/villas'), 2000)
  } catch (error) {
    toast.error('❌ Failed to update villa')
  }
}


  if (loading) return <p className="p-4 text-gray-500">Loading villa data...</p>

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-md shadow-md">
      <Toaster />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Villa</h2>
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
          Update Villa
        </button>
      </form>
    </div>
  )
}
