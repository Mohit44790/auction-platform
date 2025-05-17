import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { loginUser } from '../redux/slice/authSlice';


const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Use navigate instead of history.push

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((res) => {
      if (!error && res.type === 'auth/loginUser/fulfilled') {
        // Show success toast
        toast.success("Login successful! Redirecting...");
        // Redirect on successful login
        navigate('/');
      } else {
        // Show error toast
        toast.error(error || "Login failed. Please try again.");
      }
    });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://plus.unsplash.com/premium_photo-1684444605542-93725082d214?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="w-full max-w-md p-8 bg-white bg-opacity-45 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold  text-center text-white mb-6">Login</h2>

        {/* Error message display */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-900">
          Don't have an account? <a href="/register" className="text-blue-800 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
