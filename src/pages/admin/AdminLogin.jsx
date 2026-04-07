import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Supers3cretPassword2026!') {
      localStorage.setItem('adminToken', 'leela-secret-verified');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-serif text-[#ffd54f] text-center mb-6">Admin Access</h1>
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-center mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-black">
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl outline-none"
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl outline-none"
            required
          />
          <button 
            type="submit"
            className="w-full bg-[#ffd54f] py-3 rounded-xl font-bold mt-4 hover:bg-[#ffcc80] transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
