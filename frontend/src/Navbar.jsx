import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserAuthContext } from './context/UserAuthContext';
import UserAuthModal from './UserAuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // useLocation hook se current path pata karenge active link ke liye
  const location = useLocation();
  const { isLoggedIn, bootstrapped, user, logout } = useContext(UserAuthContext);
  const [userAuthOpen, setUserAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // NavLinks data - yahan paths define kiye hain
  const navLinks = [
    { name: 'Home', path: '/', hindi: 'होम' },
    { name: 'Services', path: '/Services', hindi: 'सेवाएं' },
    { name: 'About', path: '/About', hindi: 'बारे में' }, 
    { name: 'Contact', path: '/Contact', hindi: 'कन्टैक्ट' }, // Abhi ke liye #
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileOpen]);

  const userInitial = (() => {
    const n = String(user?.name || user?.email || "").trim();
    if (!n) return "?";
    return n[0].toUpperCase();
  })();

  // Active link check karne ka function
  const isActive = (path) => {
    if (path === '#') return false;
    return location.pathname === path;
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <span className="text-white font-bold text-xl">e</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-gray-800">e-</span>
                  <span className="bg-gradient-to-r from-blue-600 to-orange-500 text-transparent bg-clip-text">Mitra</span>
                </span>
                <span className="text-xs text-gray-500 tracking-wide -mt-1">
                  Digital Service Center
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 text-center rounded-lg group ${
                    isActive(link.path)
                      ? 'text-orange-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">{link.hindi}</span>
                  
                  {/* Active/Hover Indicator */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-300 ${
                      isActive(link.path) ? 'w-8' : 'w-0 group-hover:w-6'
                    }`}
                  ></span>
                </Link>
              ))}
              
              {bootstrapped && isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="ml-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-700"
                  >
                    My dashboard
                  </Link>
                  <div className="relative ml-2">
                    <button
                      type="button"
                      onClick={() => setProfileOpen((v) => !v)}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold shadow-md shadow-orange-500/20 hover:opacity-95"
                      aria-haspopup="dialog"
                      aria-expanded={profileOpen}
                      title="Account"
                    >
                      {userInitial}
                    </button>
                    {profileOpen ? (
                      <>
                        <button
                          type="button"
                          className="fixed inset-0 z-40 cursor-default bg-transparent"
                          aria-label="Close profile menu"
                          onClick={() => setProfileOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-80 z-50 rounded-2xl border border-gray-100 bg-white shadow-2xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold flex items-center justify-center shrink-0">
                              {userInitial}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Account"}</p>
                              <p className="text-xs text-gray-500 break-all mt-0.5">{user?.email || "—"}</p>
                              <p className="text-xs text-gray-600 mt-2">
                                Mobile: <span className="font-semibold text-gray-800">{user?.phone || "—"}</span>
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-2">
                            <Link
                              to="/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="w-full text-center px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-semibold border border-gray-100"
                            >
                              My dashboard
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setProfileOpen(false);
                                logout();
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                            >
                              Log out
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setUserAuthOpen(true)}
                  className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 rounded-full bg-gray-700 transition-all duration-300 origin-left ${
                    isOpen ? 'rotate-45 translate-x-0.5' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full bg-gray-700 transition-all duration-300 ${
                    isOpen ? 'opacity-0 scale-0' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full bg-gray-700 transition-all duration-300 origin-left ${
                    isOpen ? '-rotate-45 translate-x-0.5' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Menu Panel - Slides from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 md:hidden transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">e</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Menu</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <div className="p-6 space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)} // Menu close on click
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              style={{
                transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                opacity: isOpen ? 1 : 0,
                transition: `all 0.4s ease ${index * 0.1 + 0.1}s`,
              }}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive(link.path)
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {link.name === 'Home' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a2 2 0 01-2 2h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {link.name === 'Services' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
                {link.name === 'About' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {link.name === 'Contact' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              
              {/* Text */}
              <div className="text-left">
                <div className="font-semibold">{link.name}</div>
                <div className="text-xs text-gray-400">{link.hindi}</div>
              </div>
              
              {/* Arrow */}
              <svg
                className={`w-5 h-5 ml-auto transition-transform duration-300 ${
                  isActive(link.path) ? 'translate-x-1 text-orange-400' : 'text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50/50 space-y-2">
          {bootstrapped && isLoggedIn ? (
            <>
              <div className="mb-3 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold flex items-center justify-center shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Account"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center rounded-2xl bg-white border border-gray-200 text-gray-800 font-semibold"
              >
                My dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setUserAuthOpen(true);
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all duration-300"
            >
              Get Started
            </button>
          )}
          <p className="text-center text-xs text-gray-400 mt-4">
            e-Mitra Digital Services
          </p>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      <UserAuthModal open={userAuthOpen} onClose={() => setUserAuthOpen(false)} />
    </>
  );
};

export default Navbar;