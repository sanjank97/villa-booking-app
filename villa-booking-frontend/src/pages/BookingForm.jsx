import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function BookingForm() {
  const { state } = useLocation()
  const villa = state?.villa
  const navigate = useNavigate()

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [bookedDates, setBookedDates] = useState([])

  // Fetch booked dates from API
  useEffect(() => {
    if (villa?.id) {
      axios
        .get(`http://localhost:5000/api/bookings/villa/${villa.id}`)
        .then((res) => {
          const disabledDates = res.data.bookedDates.map((dateStr) => new Date(dateStr))
          setBookedDates(disabledDates)
   
        })
        .catch((err) => {
          toast.error('❌ Failed to load booked dates')
        })
    }
  }, [villa])


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!startDate || !endDate) {
    toast.error('Please select both dates');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('You must be logged in to book a villa');
    navigate('/login');
    return;
  }

  try {
    // 1. Create booking with pending status
    const bookingRes = await axios.post(
      'http://localhost:5000/api/bookings/',
      {
        villa_id: villa.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    const amount = villa.price_per_night * (Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

    // 2. Create Razorpay order
    const paymentRes = await axios.post(
      'http://localhost:5000/api/payment/create-order',
      {
        amount,
        booking_id:  bookingRes.data.bookingId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { id: order_id, amount: razorAmount, currency } = paymentRes.data;


    console.log("paymentRes", paymentRes);

    // 3. Load Razorpay checkout
    const options = {
      key: 'rzp_test_iyo2xuccNd7DP7', // ✅ Replace with your Razorpay test key
      amount: razorAmount,
      currency,
      name: villa.name,
      description: 'Villa Booking Payment',
      order_id,
      handler: async function (response) {
        // 4. Verify payment on server
        const verifyRes = await axios.post(
          'http://localhost:5000/api/payment/verify',
          {
            booking_id: bookingRes.data.bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success('🎉 Payment successful!');
        navigate('/thank-you');
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    toast.error('❌ Something went wrong!');
  }
};



  if (!villa) return <p className="p-4 text-red-500">No villa selected</p>

  return (
    <div className="p-6 mt-8 max-w-xl mx-auto bg-white rounded shadow">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Booking for {villa.name}</h2>
      <p className="mb-2">Location: {villa.location}</p>
      <p className="mb-2">Price/Night: ₹{villa.price_per_night}</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            excludeDates={bookedDates}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="w-full border px-3 py-2 rounded"
            placeholderText="Select start date"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            excludeDates={bookedDates}
            minDate={startDate || new Date()}
            dateFormat="yyyy-MM-dd"
            className="w-full border px-3 py-2 rounded"
            placeholderText="Select end date"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  )
}
