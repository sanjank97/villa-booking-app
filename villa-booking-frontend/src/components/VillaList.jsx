import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

export function VillaList() {
  const [villas, setVillas] = useState([])
  const [filteredVillas, setFilteredVillas] = useState([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [locations, setLocations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [villasPerPage] = useState(5) // You can adjust this number
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/villas')
        setVillas(response.data)
        
        // Extract unique locations from villas
        const uniqueLocations = [...new Set(response.data.map(villa => villa.location))]
        setLocations(uniqueLocations)
      } catch (error) {
        console.error('Error fetching villas:', error)
      }
    }

    fetchVillas()
  }, [])

  useEffect(() => {
    // Apply all filters whenever any filter changes
    const filtered = villas.filter(villa => {
      // Price filter
      const price = parseFloat(villa.price_per_night)
      const min = minPrice ? parseFloat(minPrice) : 0
      const max = maxPrice ? parseFloat(maxPrice) : Infinity
      const priceMatch = price >= min && price <= max
      
      // Title filter (case insensitive)
      const titleMatch = villa.name.toLowerCase().includes(searchTitle.toLowerCase())
      
      // Location filter
      const locationMatch = selectedLocation ? villa.location === selectedLocation : true
      
      return priceMatch && titleMatch && locationMatch
    })
    
    setFilteredVillas(filtered)
    setCurrentPage(1) // Reset to first page whenever filters change
  }, [villas, minPrice, maxPrice, searchTitle, selectedLocation])

  // Get current villas for pagination
  const indexOfLastVilla = currentPage * villasPerPage
  const indexOfFirstVilla = indexOfLastVilla - villasPerPage
  const currentVillas = filteredVillas.slice(indexOfFirstVilla, indexOfLastVilla)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleEdit = (villa) => {
    navigate(`/admin/dashboard/edit-villa/${villa.id}`)
  }

  const handleDelete = async (villaId) => {
  if (window.confirm('Are you sure you want to delete this villa?')) {
    try {
      const token = localStorage.getItem('token') // or however you store the JWT

      await axios.delete(`http://localhost:5000/api/villas/${villaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setVillas(prev => prev.filter(v => v.id !== villaId))
      toast.success('✅ Villa deleted successfully!')
    } catch (err) {
      console.error('Failed to delete villa:', err)
      toast.error('❌ Failed to delete villa')
    }
  }
}

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Villas</h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Title Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by Title</label>
          <input
            type="text"
            placeholder="Villa name..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Price Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {indexOfFirstVilla + 1}-{Math.min(indexOfLastVilla, filteredVillas.length)} of {filteredVillas.length} villas
      </div>

      {currentVillas.length === 0 ? (
        <p className="text-gray-500">No villas found matching your criteria.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {currentVillas.map((villa) => (
              <li
                key={villa.id}
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{villa.name}</h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Description:</span> {villa.description}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Location:</span> {villa.location}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-medium">Price/Night:</span> ₹{villa.price_per_night}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(villa)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(villa.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.ceil(filteredVillas.length / villasPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 border-t border-b ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredVillas.length / villasPerPage)}
                className={`px-3 py-1 rounded-r-md border ${currentPage === Math.ceil(filteredVillas.length / villasPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}