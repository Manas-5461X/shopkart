import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-[10rem] sm:text-[14rem] leading-none font-black text-gray-50 tracking-tighter select-none">
          404
        </h1>
        <div className="-mt-12 sm:-mt-20 mb-10 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Page not found
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
            The page you are looking for doesn't exist or has been moved. Let's get you back to shopping.
          </p>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 relative z-10"
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
