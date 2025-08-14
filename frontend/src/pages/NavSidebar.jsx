import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';

function NavSidebar({ isOpen, onClose, sidebarCategoryOpen, toggleCategory, subscribeRef }) {
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch('/api/posts/categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    if (sidebarCategoryOpen) {
      fetchCategories();
    }
  }, [sidebarCategoryOpen]);


  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit = isValidEmail(email) && isChecked && !submitting;

  const handleSubscribe = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setEmail('');
        setIsChecked(false);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col font-poppins ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-0 bg-black text-white w-8 h-8 text-sm flex items-center justify-center"
        >
          ✕
        </button>

        <img
          src="/assets/images/logo/logo1.png"
          className="w-72 mt-5"
          loading='lazy'
          alt="logo"
        />

        <div className="mt-6 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-[#dddddd] scrollbar-track-transparent hover:scrollbar-thumb-[#c0bebe] flex flex-col">
          <div className="flex flex-col gap-4 px-4 text-black">
            <LinkBlock to="/" label="Home" onClose={onClose} />
            <LinkBlock to="/blog" label="Blog" onClose={onClose} />
            <CategoryBlock
              isOpen={sidebarCategoryOpen}
              toggleCategory={toggleCategory}
              onClose={onClose}
              categories={categories}
              loading={loadingCategories}
            />
            <LinkBlock to="/about" label="About" onClose={onClose} />
          </div>

          <div
            className="mt-12 mx-4 p-6 min-h-[22rem] bg-white rounded shadow-[0_0_30px_rgba(0,0,0,0.08)] max-w-sm border border-black border-opacity-10 flex flex-col justify-center"
            ref={subscribeRef}
          >
            <h2 className="font-semibold text-xl text-center mb-2">
              Join for Updates
            </h2>

            <p className="text-center text-gray-600 mb-4 text-sm">
              Stay ahead with fresh insights on tech, design, and business.
            </p>

            <input
              type="email"
              placeholder="Your email address.."
              className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-sm text-center focus:outline-none disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />

            <button
              className="w-full bg-orange-600 text-white font-semibold text-sm py-2 rounded hover:bg-orange-700 transition duration-200 disabled:bg-orange-300 disabled:cursor-not-allowed"
              onClick={handleSubscribe}
              disabled={!canSubmit}
            >
              {submitting ? 'JOINING...' : 'JOIN'}
            </button>

            {message && (
              <p
                className={`text-sm text-center mt-2 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {message}
              </p>
            )}

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 mr-2"
              />
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <span
                  className="underline cursor-pointer"
                  onClick={() => {
                    navigate('/terms');
                    onClose();
                  }}
                >
                  Terms
                </span>{' '}
                and{' '}
                <span
                  className="underline cursor-pointer"
                  onClick={() => {
                    navigate('/privacy');
                    onClose();
                  }}
                >
                  Privacy Policy
                </span>.
              </p>

            </div>
          </div>

          <div className="flex gap-4 justify-center items-center w-full min-h-24 mx-auto mt-4 mb-2 max-sm:mb-16">
            <a href="https://www.instagram.com/startwithtech/" target="_blank" rel="noreferrer"
              className="w-9 h-9 text-black bg-white border-2 hover:text-[#fa5005] transition-all duration-300 flex items-center justify-center rounded-full text-xl">
              <FaInstagram />
            </a>
            <a href="https://x.com/itstechstart" target="_blank" rel="noreferrer"
              className="w-9 h-9 text-black bg-white border-2 hover:text-[#fa5005] transition-all duration-300 flex items-center justify-center rounded-full text-xl">
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavSidebar;

function LinkBlock({ to, label, onClose }) {
  return (
    <div>
      <Link to={to} onClick={onClose}>{label}</Link>
      <hr className="border-t border-gray-400 opacity-30 mt-1" />
    </div>
  );
}

function CategoryBlock({ isOpen, toggleCategory, onClose, categories, loading }) {
  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleCategory}
      >
        <span>Categories</span>
        <FiChevronDown
          className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in ${isOpen ? 'max-h-60 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
          }`}
      >
        <ul className="mt-2 ml-2 flex flex-col text-sm text-gray-800 gap-1">
          {loading ? (
            <li className="px-2 py-1 text-gray-400">Loading...</li>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  to={`/category/${cat.name}`}
                  onClick={onClose}
                  className="block px-2 py-1 hover:bg-gray-100"
                >
                  {cat.name.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              </li>
            ))) : (
            <li className="px-2 py-1 text-gray-400">No categories</li>
          )}
        </ul>
      </div>
      <hr className="border-t border-gray-400 opacity-30 mt-2" />
    </div>
  );
}
