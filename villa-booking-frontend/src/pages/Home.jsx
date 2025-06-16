import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Luxury Villas</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Discover breathtaking villas and book your perfect stay today.
        </p>
        <Link
          to="/villas"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
        >
          Explore Villas
        </Link>
      </section>

      {/* Featured Villas Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Featured Villas</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample Villa Cards */}
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <img
                src={`https://source.unsplash.com/600x400/?villa,beach,${id}`}
                alt="Villa"
                className="rounded-md mb-4 w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Luxury Villa {id}</h3>
              <p className="text-gray-600 mb-4">
                Enjoy your stay with ocean views, private pool, and 5-star amenities.
              </p>
              <Link
                to="/villas"
                className="text-blue-600 hover:underline font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">What Our Guests Say</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded shadow">
              <p className="italic text-gray-700 mb-3">
                “The villa was amazing, and the staff was extremely helpful. Will definitely come back!”
              </p>
              <h4 className="font-semibold text-gray-800">— Priya Sharma</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded shadow">
              <p className="italic text-gray-700 mb-3">
                “A dream vacation! Perfect location, top-notch service, and a beautiful villa.”
              </p>
              <h4 className="font-semibold text-gray-800">— Arjun Mehta</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Luxury Villas. All rights reserved.
      </footer>
    </div>
  )
}
