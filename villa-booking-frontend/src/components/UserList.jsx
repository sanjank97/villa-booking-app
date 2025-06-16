import { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaEdit, FaTrash, FaFileExport, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function UserList() {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const usersPerPage = 5;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.success) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        } else {
          setError('Failed to load users');
        }
      } catch (err) {
        setError('Error fetching users: ' + err.message);
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let temp = [...users];
    
    // Apply search filter
    if (searchTerm) {
      temp = temp.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      temp = temp.filter(user => user.role === roleFilter);
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      temp = temp.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate >= startDate && userDate <= endDate;
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      temp.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(temp);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, roleFilter, startDate, endDate, sortConfig]);

  // Sort handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort icon renderer
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ml-1" /> 
      : <FaSortDown className="ml-1" />;
  };

  // CSV Export
  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Name', 'Email', 'Role', 'Created At'];
      const data = filteredUsers.map(user => [
        user.id,
        `"${user.name}"`, // Wrap in quotes to handle commas in names
        user.email,
        user.role,
        new Date(user.created_at).toLocaleString()
      ]);

      let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + data.map(row => row.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `users_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      alert('Error exporting to CSV');
    }
  };

  // PDF Export
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('User List', 14, 16);
      doc.autoTable({
        head: [['ID', 'Name', 'Email', 'Role', 'Created At']],
        body: filteredUsers.map(user => [
          user.id,
          user.name,
          user.email,
          user.role,
          new Date(user.created_at).toLocaleString()
        ]),
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      doc.save(`users_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      alert('Error exporting to PDF');
    }
  };

  // Delete user handler
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user');
      }
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Loading and error states
  if (isLoading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Users</h2>

      {/* Filters and Export Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
          />
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-48"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          
          {/* Date Range Filter */}
          <div className="flex gap-2 w-full md:w-auto">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaFileExport /> CSV
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <FaFileExport /> PDF
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {(currentPage - 1) * usersPerPage + 1}-{Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow rounded-md mb-6">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th 
                className="px-4 py-3 border-b text-left cursor-pointer"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center">
                  ID {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="px-4 py-3 border-b text-left cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-4 py-3 border-b text-left cursor-pointer"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th 
                className="px-4 py-3 border-b text-left cursor-pointer"
                onClick={() => requestSort('role')}
              >
                <div className="flex items-center">
                  Role {getSortIcon('role')}
                </div>
              </th>
              <th 
                className="px-4 py-3 border-b text-left cursor-pointer"
                onClick={() => requestSort('created_at')}
              >
                <div className="flex items-center">
                  Created At {getSortIcon('created_at')}
                </div>
              </th>
              <th className="px-4 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{user.id}</td>
                  <td className="px-4 py-3 border-b">{user.name}</td>
                  <td className="px-4 py-3 border-b">{user.email}</td>
                  <td className="px-4 py-3 border-b capitalize">{user.role}</td>
                  <td className="px-4 py-3 border-b">{new Date(user.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        onClick={() => console.log('Edit', user.id)} // Replace with your edit function
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
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
    </div>
  );
}