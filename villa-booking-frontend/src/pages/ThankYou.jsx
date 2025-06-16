export default function ThankYou() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your villa has been successfully booked. We’ve sent you a confirmation email.
      </p>
      <a
        href="/"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Back to Home
      </a>
    </div>
  )
}