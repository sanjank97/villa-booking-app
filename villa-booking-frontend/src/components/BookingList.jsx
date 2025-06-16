import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
        setFilteredBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to fetch bookings');
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking => {
      // Search filter
      const matchesSearch = 
        booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.villa_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter ? booking.status === statusFilter : true;
      
      // Location filter
      const matchesLocation = locationFilter ? booking.location === locationFilter : true;
      
      // Date range filter
      let matchesDate = true;
      if (startDateFilter && endDateFilter) {
        const bookingStartDate = new Date(booking.start_date);
        const bookingEndDate = new Date(booking.end_date);
        matchesDate = 
          (bookingStartDate >= startDateFilter && bookingStartDate <= endDateFilter) ||
          (bookingEndDate >= startDateFilter && bookingEndDate <= endDateFilter) ||
          (bookingStartDate <= startDateFilter && bookingEndDate >= endDateFilter);
      }
      
      return matchesSearch && matchesStatus && matchesLocation && matchesDate;
    });
    
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [bookings, searchTerm, statusFilter, locationFilter, startDateFilter, endDateFilter]);

  // Get unique locations for dropdown
  const uniqueLocations = [...new Set(bookings.map(booking => booking.location))];

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setLocationFilter('');
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearFilters}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="User, email, or villa"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={startDateFilter}
              onChange={date => setStartDateFilter(date)}
              selectsStart
              startDate={startDateFilter}
              endDate={endDateFilter}
              placeholderText="Start Date"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={endDateFilter}
              onChange={date => setEndDateFilter(date)}
              selectsEnd
              startDate={startDateFilter}
              endDate={endDateFilter}
              minDate={startDateFilter}
              placeholderText="End Date"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {indexOfFirstBooking + 1}-{Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
      </div>

      {currentBookings.length === 0 ? (
        <p className="text-gray-500">No bookings found matching your criteria.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow rounded-md mb-6">
            <table className="min-w-full border border-gray-200 bg-white text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 border">ID</th>
                  <th className="px-4 py-3 border">User Name</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Villa</th>
                  <th className="px-4 py-3 border">Location</th>
                  <th className="px-4 py-3 border">Start Date</th>
                  <th className="px-4 py-3 border">End Date</th>
                  <th className="px-4 py-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{booking.id}</td>
                    <td className="px-4 py-3 border">{booking.user_name}</td>
                    <td className="px-4 py-3 border">{booking.email}</td>
                    <td className="px-4 py-3 border">{booking.villa_name}</td>
                    <td className="px-4 py-3 border">{booking.location}</td>
                    <td className="px-4 py-3 border">{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 border">{new Date(booking.end_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 border">
                      <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-600'
                          : booking.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-red-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
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
                    onClick={() => paginate(i + 1)}
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
  );
}