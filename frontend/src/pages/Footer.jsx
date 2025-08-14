import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-black text-white font-poppins py-10">
            <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                <img src="/assets/images/logo/logo2.png" alt="Logo" className="w-72" />

                <div className="flex gap-4">
                    <a
                        href="https://www.instagram.com/startwithtech/" target='_blank'
                        className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center rounded-full text-xl"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://x.com/itstechstart" target='_blank'
                        className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center rounded-full text-xl"
                    >
                        <FaXTwitter />
                    </a>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base font-medium">
                    <Link to="/" onClick={() => window.scrollTo({ top: 0 })}>HOME</Link>
                    <Link to="/blog" onClick={() => window.scrollTo({ top: 0 })}>BLOG</Link>
                    <Link to="/about" onClick={() => window.scrollTo({ top: 0 })}>ABOUT</Link>
                    <Link to="/contact" onClick={() => window.scrollTo({ top: 0 })}>CONTACT</Link>
                    <Link to="/terms" onClick={() => window.scrollTo({ top: 0 })}>TERMS</Link>
                    <Link to="/privacy" onClick={() => window.scrollTo({ top: 0 })}>PRIVACY</Link>
                    <Link to="/disclaimer" onClick={() => window.scrollTo({ top: 0 })}>DISCLAIMER</Link>
                </div>


                <div className="text-xs sm:text-sm text-gray-400 text-center mt-4">
                    © {new Date().getFullYear()} <span className="text-white font-semibold">StartWithTech</span>. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
