// src/admin/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
  // Dummy Stats Data
  const stats = [
    { label: 'Total Services', value: '24', icon: '🛠️', color: 'blue' },
    { label: 'Total Orders', value: '124', icon: '📦', color: 'green' },
    { label: 'Pending Requests', value: '12', icon: '⏳', color: 'yellow' },
    { label: 'Total Revenue', value: '₹45,000', icon: '💰', color: 'purple' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</h3>
              </div>
              <span className="text-3xl bg-gray-100 p-2 rounded-lg">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                N
              </div>
              <div>
                <p className="font-medium text-gray-800">New Order Received #{item}</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;