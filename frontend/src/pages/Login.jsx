import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to complete request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden bg-gradient-to-br from-[#FAF8F3] to-[#F2EFE9]">
      
      {/* Decorative leaf/branch pattern placeholder (SVG) */}
      <div className="absolute bottom-0 left-0 w-64 h-full pointer-events-none opacity-20">
        <svg viewBox="0 0 100 200" fill="none" stroke="#D3B888" strokeWidth="0.5" className="h-full w-full object-cover origin-bottom-left scale-150 transform -translate-x-12 translate-y-24">
          <path d="M 50 200 Q 40 100 60 0" strokeDasharray="2,2"/>
          <path d="M 45 150 Q 20 120 10 140 Q 30 160 45 150" fill="#FAF8F3"/>
          <path d="M 48 100 Q 10 80 5 100 Q 20 120 48 100" fill="#FAF8F3"/>
          <path d="M 53 120 Q 80 90 90 110 Q 70 130 53 120" fill="#FAF8F3"/>
          <path d="M 55 60 Q 90 40 95 60 Q 75 80 55 60" fill="#FAF8F3"/>
          <path d="M 58 20 Q 30 0 20 20 Q 40 40 58 20" fill="#FAF8F3"/>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-4">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50 px-8 py-12 backdrop-blur-sm">
          
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-[#B8860B] rounded-full flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-serif text-2xl font-medium tracking-wider">tdc</span>
            </div>
            <h2 className="text-xs font-serif font-bold tracking-[0.25em] text-gray-800 mb-4 uppercase">
              The Date Crew
            </h2>
            <div className="flex items-center justify-center gap-3 w-32 opacity-40">
              <div className="h-px bg-gray-400 flex-1"></div>
              <Heart className="w-3 h-3 text-[#B8860B] fill-[#B8860B]" />
              <div className="h-px bg-gray-400 flex-1"></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-gray-900 mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[15px] text-gray-500 font-light">
              Sign in to your matchmaker workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-[18px] h-[18px] text-[#B8860B]/60" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#B8860B]/50 focus:border-[#B8860B]/50 transition-colors text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-[18px] h-[18px] text-[#B8860B]/60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#B8860B]/50 focus:border-[#B8860B]/50 transition-colors text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#B8860B] focus:ring-[#B8860B]/30"
                />
                <span className="text-[13px] text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-[13px] text-[#B8860B] hover:text-[#9A7009] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-white font-medium text-[15px]
                         bg-[#0E4F36] hover:bg-[#0A3D2A] active:scale-[0.98] disabled:opacity-70 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-8 gap-4">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[13px] text-gray-400">or</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Lock className="w-[14px] h-[14px]" />
            <span className="text-[13px]">Private. Verified. Matchmaker-only access.</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 text-center flex flex-col items-center">
        <Heart className="w-3.5 h-3.5 text-[#B8860B] fill-[#B8860B] mb-2" />
        <p className="text-xs text-gray-400">
          © 2026 The Date Crew. All rights reserved.
        </p>
      </div>
    </div>
  );
}
