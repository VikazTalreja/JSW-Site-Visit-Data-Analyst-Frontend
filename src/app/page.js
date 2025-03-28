"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Ensure loggedIn is false on page load
  useEffect(() => {
    localStorage.setItem('loggedIn', 'false');
  }, []);

  // Create random pixels for animation
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    const newPixels = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 5,
      delay: 10+ Math.random() * 8,
      duration: 1 + Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.3
    }));
    setPixels(newPixels);
  }, []);

      // Use environment variables for validation
      const validEmail = process.env.NEXT_PUBLIC_USER_EMAIL; // Use NEXT_PUBLIC_ prefix for client-side access
      const validPassword = process.env.NEXT_PUBLIC_USER_PASSWORD;

      
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (username === 'jswuser2@demo.com'
      && password === '12345') {

      localStorage.setItem('loggedIn', 'true');
      router.push('/chat');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-200 text-white relative">
      <div className="bg-white shadow-lg shadow-blue-200 rounded-2xl p-8 w-full max-w-sm relative z-10">
        <h1 className="text-3xl text-black font-bold text-center">JSW Steel</h1>
        <p className="text-sm text-gray-700 text-center mt-2">Sales Insights Dashboard</p>
        
        {error && <div className="mt-4 p-2 text-sm text-red-500 text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-950">Email Address</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-black  border border-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-black border border-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:cursor-pointer transition py-2 rounded-md font-bold"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Pixel Animation */}
      {/* <div className="absolute inset-72 overflow-hidden">
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            className="absolute  bg-blue-400 rounded-full opacity-50"
            style={{
              left: pixel.left,
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              animation: `float ${pixel.duration}s infinite ease-in-out`,
              animationDelay: `${pixel.delay}s`
            }}
          />
        ))}
      </div> */}

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(100px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
