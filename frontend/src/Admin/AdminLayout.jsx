// src/admin/AdminLayout.jsx
import React, { useContext, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

const AdminLayout = () => {
  const location = useLocation();
  const { isAuthed, user, logout, bootstrapped } = useContext(AuthContext);
  const [authOpen, setAuthOpen] = useState(false);

  const display = useMemo(() => {
    if (!user) return { name: "Admin", email: "", initial: "A", role: "" };
    const initial = (user.email?.[0] || "A").toUpperCase();
    return { name: user.role || "Admin", email: user.email || "", initial, role: user.role || "" };
  }, [user]);

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin' },
    { name: 'Manage Services', icon: '🛠️', path: '/admin/services' },
    { name: 'Gallery', icon: '🖼️', path: '/admin/gallery' },
    { name: 'Messages', icon: '✉️', path: '/admin/messages' },
    { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-orange-400">Admin Panel</h1>
          <p className="text-xs text-gray-400">e-Mitra Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                location.pathname === item.path 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <span>←</span> Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isAuthed ? `Welcome, ${display.name}!` : "Admin Login Required"}
            </h2>
            {display.role ? (
              <p className="text-xs text-gray-500 mt-0.5">Role: {display.role}</p>
            ) : null}
          </div>
          
          <div className="flex items-center gap-4">
            {bootstrapped && !isAuthed ? (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow shadow-orange-200"
              >
                Login
              </button>
            ) : null}

            {isAuthed ? (
              <>
                {display.role === "superadmin" ? (
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                    title="Create admin users"
                  >
                    Create Admin
                  </button>
                ) : null}

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold"
                >
                  Logout
                </button>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{display.name}</p>
                  <p className="text-xs text-gray-400">{display.email}</p>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {display.initial}
                </div>
              </>
            ) : null}
          </div>
        </header>

        {/* Page Content Renders Here */}
        <div className="p-8">
          {!bootstrapped ? null : isAuthed ? (
            <Outlet />
          ) : (
            <div className="max-w-xl bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Please login to continue</h3>
              <p className="text-sm text-gray-600 mt-1">
                Admin panel access ke liye login zaroori hai.
              </p>
              <button
                onClick={() => setAuthOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow shadow-orange-200"
              >
                Open Login
              </button>
            </div>
          )}
        </div>
      </main>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default AdminLayout;