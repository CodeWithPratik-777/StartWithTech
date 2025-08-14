import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsAppLoading } = useLoading();

  const sanitizeInput = (str) => str.replace(/<[^>]*>?/gm, '');

  const handleChange = (e) => {
    const { id, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [id]: sanitizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsAppLoading(true);

    const fallbackTimeout = setTimeout(() => {
      setIsAppLoading(false);
    }, 6000);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success('Thank you! We’ll be in touch soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      clearTimeout(fallbackTimeout);
      setIsSubmitting(false);
      setIsAppLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl font-poppins">
      <h2 className="font-bold text-xl mb-6">
        <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
          Contact Us
        </span>
      </h2>

      <p className="mb-8">
        Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa5005] transition"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa5005] transition"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            id="subject"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            maxLength={100}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa5005] transition"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea
            id="message"
            rows="5"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            maxLength={1000}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fa5005] transition resize-none"
            required
            disabled={isSubmitting}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-[#fa5005] text-white font-medium px-6 py-2 rounded-md transition duration-200 ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#e14a00]'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Contact;
