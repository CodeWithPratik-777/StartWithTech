import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import OtpModal from './OtpModal';
import { useLoading } from '../context/LoadingContext'; 
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpUserId, setOtpUserId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAppLoading } = useLoading();

  useEffect(() => {
    setIsAppLoading(true); 
    const timeout = setTimeout(() => {
      setIsAppLoading(false);
    }, 800); 

    return () => clearTimeout(timeout);
  }, [setIsAppLoading]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verified = queryParams.get('verified');

    if (verified === 'true') toast.success('Email verified.');
    else if (verified === 'false') toast.error('Invalid or expired verification link.');

    if (verified) {
      setTimeout(() => {
        queryParams.delete('verified');
        navigate({ pathname: location.pathname, search: queryParams.toString() }, { replace: true });
      }, 50);
    }
  }, [location.search, navigate, location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.twoFactorRequired) {
        setOtpUserId(data.userId);
        setShowOtpModal(true);
      } else {
        toast.success('Login successful!');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }

      setFormData({ email: '', password: '' });
    } catch (err) {
      toast.error(err.message);
      setFormData((prev) => ({ ...prev, password: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    toast.success('Login successful!');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl font-poppins">
      <ToastContainer position="top-right" />
      {showOtpModal && otpUserId && (
        <OtpModal userId={otpUserId} onClose={() => setShowOtpModal(false)} onSuccess={handleOtpSuccess} />
      )}

      <h2 className="font-bold text-xl mb-6">
        <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">Login</span>
      </h2>

      <p className="mb-8">Access your account to post, comment, and enjoy personalized content.</p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {['email', 'password'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium mb-1 capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : 'email'}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field === 'email' ? 'Enter your email' : 'Enter your password'}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa5005] transition"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className={`bg-[#fa5005] text-white font-medium px-6 py-2 rounded-md transition duration-200 w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e14a00]'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging In...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-sm text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#fa5005] font-medium hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
