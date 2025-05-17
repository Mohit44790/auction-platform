import React from 'react';
import { Link } from 'react-router-dom';



const Home = () => {
  return (
    <div className=" bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to SwiftBid
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover, bid, and win on live auctions. Create your own auctions or compete to win the best deals in real-time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auctions"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            View Auctions
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50 transition"
          >
            Login / Register
          </Link>
        </div>
      </div>

      
    </div>
  );
};

export default Home;
