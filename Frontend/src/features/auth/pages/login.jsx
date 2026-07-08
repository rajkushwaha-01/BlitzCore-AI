import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  



  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    await handleLogin(formData);
    navigate('/')
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-6 flex rounded-full bg-slate-800 p-1">
          <Link
            type="button"
            to="/login"
            className={`w-1/2 rounded-full px-4 py-2 text-sm flex items-center justify-center font-semibold transition ${isLogin ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'

              }`}
          >
            Login
          </Link>
          <Link
            type="button"
            to="/register"
            className={`w-1/2 rounded-full px-4 py-2 text-sm flex items-center justify-center font-semibold transition ${!isLogin ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'
              }`}
          >
            Register
          </Link>
        </div>

        <h2 className="text-2xl font-semibold">
          Welcome back  </h2>
        <p className="mt-2 text-sm text-slate-400">

          Sign in to continue to your account.

        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
