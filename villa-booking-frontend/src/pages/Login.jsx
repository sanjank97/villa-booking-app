import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

    // Store the token in localStorage
    localStorage.setItem('token', res.data.token);

    // Get user role from response
    const userRole = res.data.user.role;

    alert('Login successful');

    // Role-based redirection
    if (userRole === 'admin') {
      navigate('/admin/dashboard'); // replace with your actual admin route
    } else if (userRole === 'user') {
      navigate('/myaccount'); // or another route for regular users
    } else {
      navigate('/'); // default fallback
    }

  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
};


  return (
    <div>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
