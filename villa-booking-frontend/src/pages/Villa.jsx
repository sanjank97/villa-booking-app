import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Villa() {
  const [villas, setVillas] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/villas/')
        setVillas(response.data)
      } catch (error) {
        console.error('Error fetching villas:', error)
      }
    }

    fetchVillas()
  }, [])

  const handleBookNow = (villa) => {
    navigate('/booking-form', { state: { villa } })
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Villas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {villas.map((villa) => (
          <div key={villa.id} className="p-4 border rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{villa.name}</h2>
            <p>{villa.description}</p>
            <p className="text-sm text-gray-600">Location: {villa.location}</p>
            <p className="text-sm text-green-600 font-semibold">Price: ₹{villa.price_per_night}</p>
            <button
              onClick={() => handleBookNow(villa)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

