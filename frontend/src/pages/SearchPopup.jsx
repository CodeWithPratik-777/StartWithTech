import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

function SearchPopup({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  let timeoutId;

  if (isOpen) {
    setShouldRender(true);
    setTimeout(() => setVisible(true), 10);
    const y = window.scrollY;
    setScrollY(y);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
  } else {
    setVisible(false);
    setSearchTerm(''); 
    timeoutId = setTimeout(() => {
      setShouldRender(false);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }, 300);
  }

  return () => {
    clearTimeout(timeoutId);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  };
}, [isOpen]);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      onClose();
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center px-4 font-poppins bg-white transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
      `}
    >
      <button
        aria-label="Close Search"
        onClick={onClose}
        className="absolute top-6 right-6 px-2 bg-black text-white text-2xl transition-transform duration-300 hover:scale-110"
      >
        ✕
      </button>

      <div className="flex flex-col items-start w-full max-w-2xl transition-all duration-300">
        <input
          type="text"
          placeholder="Explore..."
          className="w-full text-6xl font-bold placeholder-black border-b-2 border-gray-300 focus:outline-none pb-2 mb-4"
          autoFocus
          value={searchTerm}
          onChange={(e) => {
            const inputValue = e.target.value;
            const wordCount = inputValue.trim().split(/\s+/).length;
            if (wordCount <= 12) {
              setSearchTerm(inputValue);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        <p className="text-gray-500 text-base">
          Type above and press <span className="italic">Enter</span> to search. Press <span className="italic">Esc</span> to cancel.
        </p>
      </div>
    </div>
  );
}

export default SearchPopup;
