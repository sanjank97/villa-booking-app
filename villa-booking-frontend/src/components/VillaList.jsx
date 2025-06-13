import { useEffect, useState } from 'react'
import axios from 'axios'

export function VillaList() {
  const [villas, setVillas] = useState([])

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/villas')
        setVillas(response.data)
      } catch (error) {
        console.error('Error fetching villas:', error)
      }
    }

    fetchVillas()
  }, [])

  return (
    <div>
      <h2>All Villas</h2>
      {villas.length === 0 ? (
        <p>No villas found.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {villas.map(villa => (
            <li
              key={villa.id}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                listStyle: 'none',
              }}
            >
              <h3>{villa.name}</h3>
              <p><strong>Description:</strong> {villa.description}</p>
              <p><strong>Location:</strong> {villa.location}</p>
              <p><strong>Price/Night:</strong> ${villa.price_per_night}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
