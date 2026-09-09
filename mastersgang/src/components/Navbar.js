import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import SearchPopup from './SearchPopup';

const Navbar = () => {

  const { auth, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <nav className="navbar">
      {/*Left side */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          <span className='logo-icon'>MG</span>
          <span className="logo-text">MastersGang</span>
        </Link>
        {/* Navigation */}
        {auth.user && (
          <div className="nav-links">
            <Link to="/" className="nav-link active">
              Dashboard
            </Link>

            <span className="nav-link disabled-link">
              My Classes
            </span>

            <span className="nav-link disabled-link">
              AI Assistant
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* Search */}
        <button
          className="icon-button"
          onClick={togglePopup}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="5 5 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>

        {showPopup && (
          <SearchPopup onClose={togglePopup} />
        )}

        {auth.user ? (
          <>
            {/* Profile */}
            <Link
              to="/profile"
              className="profile-button"
              aria-label="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>

            {/* Logout */}
            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>
        )}

      </div>

    </nav>
  );
};

export default Navbar;