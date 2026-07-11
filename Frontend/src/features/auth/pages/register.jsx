import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from '../hook/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const data = await handleRegister(formData);

    setIsSubmitting(false);

    if (data) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/40 backdrop-blur">

        {isSubmitted ? (
          /* ---------- SUCCESS STATE ---------- */
          <div className="flex flex-col items-center py-6 text-center">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              {/* Pulsing rings */}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/20"></span>
              <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-emerald-500/30 [animation-delay:150ms]"></span>

              {/* Envelope icon that bounces in */}
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/40 animate-[popIn_0.5s_ease-out]">
                <HiOutlineMailOpen className="h-10 w-10 text-emerald-400" />
              </div>

              {/* Checkmark badge */}
              <div className="absolute -bottom-1 -right-1 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg animate-[popIn_0.5s_ease-out_0.3s_both]">
                <FiCheckCircle className="h-5 w-5" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold">Verification email sent</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We've sent a verification link to{' '}
              <span className="font-medium text-slate-200">{formData.email}</span>.
              Please check your inbox and verify your account before logging in.
            </p>

            <div className="mt-6 w-full rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3 text-xs text-slate-400">
              Didn't get the email? Check your spam folder, or try registering again.
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-6 w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Go to Login
            </button>
          </div>
        ) : (
          /* ---------- FORM STATE ---------- */
          <>
            <div className="mb-6 flex rounded-full bg-slate-800 p-1">
              <Link
                type="button"
                to="/login"
                onClick={() => setIsLogin(true)}
                className={`w-1/2 rounded-full px-4 py-2 text-sm flex items-center justify-center font-semibold transition ${
                  isLogin ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link
                type="button"
                to="/register"
                onClick={() => setIsLogin(false)}
                className={`w-1/2 rounded-full px-4 py-2 text-sm flex items-center justify-center font-semibold transition ${
                  !isLogin ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Register
              </Link>
            </div>

            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="mt-2 text-sm text-slate-400">
              Register to get started with your new account.
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
                <label className="mb-2 block text-sm text-slate-300" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
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
                disabled={isSubmitting}
                className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Sending verification email...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Custom keyframes (Tailwind's arbitrary animate-[...] references this) */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Register;