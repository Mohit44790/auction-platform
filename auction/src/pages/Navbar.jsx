import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logoutUser } from '../redux/slice/authSlice';

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">SwiftBid</Link>
        <div className="flex gap-4">
          <Link to="/auctions" className="text-gray-700 hover:text-blue-600">Auctions</Link>
          {user ? (
            <>
              <Link to="/create-auction" className="text-gray-700 hover:text-blue-600">Create Auction</Link>
              <Link to="/auctionlist" className="text-gray-700 hover:text-blue-600">Auction List</Link>
              <Link to="/my-auctions" className="text-gray-700 hover:text-blue-600">My Auctions</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
