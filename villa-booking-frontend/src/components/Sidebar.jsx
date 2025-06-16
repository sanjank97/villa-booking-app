import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function Sidebar() {
  const [isVillaOpen, setVillaOpen] = useState(false)

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Menu</h2>
      <ul className="space-y-2 text-gray-700">

        {/* Villas Menu */}
        <li>
          <button
            onClick={() => setVillaOpen(!isVillaOpen)}
            className="w-full flex items-center justify-between font-semibold px-2 py-2 rounded hover:bg-gray-100"
          >
            <span>Villas</span>
            {isVillaOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isVillaOpen && (
            <ul className="ml-4 mt-2 space-y-1">
              <li>
                <NavLink
                  to="villas"
                  className="block px-2 py-1 rounded hover:bg-blue-100"
                >
                  All Villas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="add-villa"
                  className="block px-2 py-1 rounded hover:bg-blue-100"
                >
                  Add Villa
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Users */}
        <li>
          <NavLink
            to="users"
            className="block px-2 py-2 font-semibold rounded hover:bg-gray-100"
          >
            Users
          </NavLink>
        </li>

        {/* Bookings */}
        <li>
          <NavLink
            to="bookings"
            className="block px-2 py-2 font-semibold rounded hover:bg-gray-100"
          >
            Bookings
          </NavLink>
        </li>

      </ul>
    </div>
  )
}
