import './App.css';
import { useState, useContext } from "react";
import { 
  FaIdCard, FaBolt, FaWater, FaCreditCard, FaPassport, FaVoteYea, 
  FaFileAlt, FaHome, FaUserCheck, FaCertificate, FaAddressCard, FaWpforms, FaSearch 
} from "react-icons/fa";
import { ServiceContext } from './context/ServiceContext'; 

function Services() {

  // Context se Data
  const { services, loading } = useContext(ServiceContext);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Icon Mapping Logic
  const iconMap = {
    "FaIdCard": FaIdCard,
    "FaCreditCard": FaCreditCard,
    "FaBolt": FaBolt,
    "FaWater": FaWater,
    "FaPassport": FaPassport,
    "FaVoteYea": FaVoteYea,
    "FaFileAlt": FaFileAlt,
    "FaHome": FaHome,
    "FaUserCheck": FaUserCheck,
    "FaCertificate": FaCertificate,
    "FaAddressCard": FaAddressCard
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : <FaWpforms />;
  };

  // Filter Logic
  const filteredServices = services.filter((s) => {
    const matchCategory = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      
      {/* HERO SECTION - Exact Screenshot Style */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">All Services</h1>
          <p className="text-blue-200 mt-1 text-sm">
            सभी सेवाएं - Complete list of government services
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Search Input with Icon */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["All", "Documents", "Bills", "Certificates", "Welfare Schemes"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-blue-900 text-white shadow-md" // Active State
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Inactive State
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((s) => (
              <div
                key={s._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative"
              >
                
                {/* Category Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {s.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-grow">
                  {/* Icon */}
                  <div className="text-blue-600 text-3xl mb-4">
                    {getIcon(s.icon)}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-800 text-base mb-1">
                    {s.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {s.title}
                  </p>
                </div>

                {/* Price & Apply Footer */}
                <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center mt-auto">
                  {/* Price */}
                  <span className="text-green-600 font-bold text-sm">
                    {s.price ? s.price : 'Free'}
                  </span>
                  
                  {/* Apply Button */}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors">
                    Apply
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              No services found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;