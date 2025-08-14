import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsAppLoading } = useLoading();

  useEffect(() => {
    setIsAppLoading(false);
  }, [setIsAppLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setIsAppLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      toast.success('Signup successful. Check your email for verification link.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.message);
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } finally {
      setIsSubmitting(false);
      setIsAppLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl font-poppins">
      <ToastContainer position="top-right" />

      <h2 className="font-bold text-xl mb-6">
        <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
          Create Account
        </span>
      </h2>

      <p className="mb-8">
        Join our community to post, comment, and personalize your reading experience.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {['username', 'email', 'password', 'confirmPassword'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium mb-1 capitalize">
              {field === 'confirmPassword' ? 'Confirm Password' : field}
            </label>
            <input
              type={field.toLowerCase().includes('password') ? 'password' : field}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={
                field === 'username'
                  ? 'Choose a username'
                  : field === 'email'
                  ? 'Enter your email'
                  : field === 'password'
                  ? 'Create a password'
                  : 'Re-enter your password'
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa5005] transition"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className={`bg-[#fa5005] text-white font-medium px-6 py-2 rounded-md transition duration-200 w-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e14a00]'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-sm text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-[#fa5005] font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
