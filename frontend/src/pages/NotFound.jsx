import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext'; 

function NotFound() {
  const { setIsAppLoading } = useLoading(); 

  useEffect(() => {
    setIsAppLoading(false); 
  }, [setIsAppLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center max-w-lg mb-28">
        <h1 className="text-[120px] leading-none font-bold text-[#fa5005]">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#fa5005] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded transition duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
