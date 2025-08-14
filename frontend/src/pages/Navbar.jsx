import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiChevronDown } from 'react-icons/fi';
import NavSidebar from './NavSidebar';
import SearchPopup from './SearchPopup';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCategoryOpen, setSidebarCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const subscribeRef = useRef(null);
  const location = useLocation();

  const handleSubscribeClick = () => {
    setIsSidebarOpen(true);
    setTimeout(() => {
      if (subscribeRef.current) {
        subscribeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarCategoryOpen(false);
    setTimeout(() => {
      const sidebarContainer = document.querySelector('.scrollbar-thin');
      if (sidebarContainer) sidebarContainer.scrollTop = 0;
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsFixed(offset > 130);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch('/api/posts/categories');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className='font-poppins'>
      <div className="h-10 bg-[#fa5005] text-white flex px-8 justify-between items-center text-[13px] max-md:hidden">
        <div className="flex gap-6">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="flex gap-4 cursor-pointer">
          <a
            href="https://www.instagram.com/startwithtech/" target='_blank'
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/itstechstart" target='_blank'
          >
            <FaXTwitter />
          </a>
          <FaSearch onClick={() => setIsSearchOpen(true)} className="cursor-pointer" />
        </div>
      </div>

      <div className="px-8 pt-[4.8px] pb-4 mt-3 flex items-center justify-between relative">
        <div
          className="group flex flex-col gap-[5px] cursor-pointer rounded z-10"
          onClick={() => setIsSidebarOpen(true)}
        >
          <div className="w-8 h-[3px] bg-black group-hover:bg-[#fa5005] transition-colors duration-300"></div>
          <div className="w-6 h-[3px] bg-black group-hover:bg-[#fa5005] transition-colors duration-300"></div>
          <div className="w-4 h-[3px] bg-black group-hover:bg-[#fa5005] transition-colors duration-300"></div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 max-md:static max-md:translate-x-0 max-md:mt-4">
          <Link to="/">
            <img
              src="/assets/images/logo/logo1.png"
              loading='lazy'
              className="w-72 max-md:w-48"
              alt="logo"
            />
          </Link>
        </div>

        <div className="max-md:hidden">
          <button className="z-10 bg-transparent border-[1px] border-black px-3 py-1 border-opacity-[0.2] font-semibold hover:bg-[#fa5005]  hover:text-white transition duration-300" onClick={handleSubscribeClick}>
            Join
          </button>
        </div>

        <div className="hidden max-md:flex gap-3 mt-2">
          <FaSearch onClick={() => setIsSearchOpen(true)} className="cursor-pointer" />
        </div>
      </div>

      <div className={`${isFixed ? 'fixed top-0 left-0 w-full shadow-md bg-white z-50' : ''} transition-all duration-300 max-md:hidden`}>
        <div className="flex items-center justify-center gap-12 h-14">
          <Link
            to="/" onClick={() => window.scrollTo({ top: 0 })}
            className={`hover:text-[#fa5005] transition-colors ${isActive('/') ? 'text-[#fa5005]' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/blog" onClick={() => window.scrollTo({ top: 0 })}
            className={`hover:text-[#fa5005] transition-colors ${isActive('/blog') ? 'text-[#fa5005]' : ''}`}
          >
            Blog
          </Link>

          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-1">
              <span className="transition-colors group-hover:text-[#fa5005]">Categories</span>
              <FiChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </div>
            <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 ease-in z-50">
              <ul className="flex flex-col text-sm text-gray-800">
                {loadingCategories ? (
                  <li className="px-4 py-2 text-gray-500">Loading...</li>
                ) : categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <li key={index}>
                      <Link
                        to={`/category/${cat.name}`}
                        onClick={() => window.scrollTo({ top: 0 })}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No categories</li>
                )}
              </ul>
            </div>
          </div>

          <Link
            to="/about" onClick={() => window.scrollTo({ top: 0 })}
            className={`hover:text-[#fa5005] transition-colors ${isActive('/about') ? 'text-[#fa5005]' : ''}`}
          >
            About
          </Link>
        </div>
      </div>

      {isFixed && <div className="h-14 max-md:hidden" />}

      <NavSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        sidebarCategoryOpen={sidebarCategoryOpen}
        toggleCategory={() => setSidebarCategoryOpen(prev => !prev)}
        subscribeRef={subscribeRef}
      />
      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default Navbar;
