import React, { useState } from 'react';
import { toast } from 'react-toastify';

function OtpModal({ onClose, onSuccess, userId }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');
      
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Two-Factor Authentication</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          For your security, a 6-digit verification code was sent to your email. Please enter it below to verify your identity.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter your OTP"
            className={`w-full border border-gray-300 focus:border-[#fa5005] focus:ring-[#fa5005] rounded-lg px-4 py-3 text-lg outline-none transition-all duration-200 mb-4 ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            required
            disabled={loading}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#fa5005] hover:bg-[#e04800] text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpModal;
