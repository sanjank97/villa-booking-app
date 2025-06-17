import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';

export default function Villa() {
  const [villas, setVillas] = useState([]);
  const [filteredVillas, setFilteredVillas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const villasPerPage = 6;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    const fetchData = async () => {
      try {
        // Fetch villas
        const response = await axios.get('http://localhost:5000/api/villas/');
        setVillas(response.data);
        
        // Extract unique locations
        const uniqueLocations = [...new Set(response.data.map(villa => villa.location))];
        setLocations(uniqueLocations);

        // Fetch wishlist
        const wishlistData = await getWishlist();
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...villas];
    
    if (searchTerm) {
      filtered = filtered.filter(villa =>
        villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        villa.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(villa => villa.location === locationFilter);
    }
    
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      filtered = filtered.filter(villa => {
        const price = parseFloat(villa.price_per_night);
        return price >= min && price <= max;
      });
    }
    
    setFilteredVillas(filtered);
    setCurrentPage(1);
  }, [villas, searchTerm, locationFilter, minPrice, maxPrice]);

  // Toggle wishlist with API/localStorage handling
  const toggleWishlist = async (villaId) => {
    try {
      if (wishlist.includes(villaId)) {
        await removeFromWishlist(villaId);
        setWishlist(wishlist.filter(id => id !== villaId));
      } else {
        await addToWishlist(villaId);
        setWishlist([...wishlist, villaId]);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Pagination logic
  const indexOfLastVilla = currentPage * villasPerPage;
  const indexOfFirstVilla = indexOfLastVilla - villasPerPage;
  const currentVillas = filteredVillas.slice(indexOfFirstVilla, indexOfLastVilla);
  const totalPages = Math.ceil(filteredVillas.length / villasPerPage);

  const handleBookNow = (villa) => {
    navigate('/booking-form', { state: { villa } });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Filters Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search villas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        <button
          onClick={clearFilters}
          className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Clear All Filters
        </button>
      </div>
      
      {/* Villas Content */}
      <div className="w-full md:w-3/4">
        <h1 className="text-2xl font-bold mb-4">All Villas</h1>
        
        <div className="mb-4 text-sm text-gray-600">
          Showing {indexOfFirstVilla + 1}-{Math.min(indexOfLastVilla, filteredVillas.length)} of {filteredVillas.length} villas
        </div>
        
        {currentVillas.length === 0 ? (
          <p className="text-gray-500">No villas found matching your criteria.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentVillas.map((villa) => (
                <div key={villa.id} className="relative p-4 border rounded shadow bg-white hover:shadow-lg transition-shadow">
                  <button
                    onClick={() => toggleWishlist(villa.id)}
                    className="absolute top-3 right-3 p-2 text-lg"
                    aria-label={wishlist.includes(villa.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {wishlist.includes(villa.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                  
                  {!isLoggedIn && (
                    <div className="absolute top-3 right-12 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Sign in to save
                    </div>
                  )}
                  
                  <h2 className="text-xl font-semibold pr-8">{villa.name}</h2>
                  <p className="text-gray-600 mt-2">{villa.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Location: {villa.location}</p>
                  <p className="text-green-600 font-semibold mt-2">₹{villa.price_per_night} per night</p>
                  
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleBookNow(villa)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border-t border-b ${
                        currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}