import './App.css'
import { useState } from "react";
import { FaIdCard,FaBolt,FaWater,FaCreditCard,FaPassport,FaVoteYea,FaFileAlt, FaHome,FaUserCheck,FaCertificate,FaClipboardList,FaUserShield,FaAddressCard } from "react-icons/fa";
import { ShieldCheck, Zap, CheckCircle,ChevronDown } from "lucide-react";

function Services () {

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const services = [
    { name: "Aadhar", category: "Documents",title:"Update name, address, mobile number, or biometric details in Aadhaar",  icon: <FaIdCard /> },
    { name: "PAN Card", category: "Documents",title:"Apply for new PAN card or make corrections to existing PAN card", icon: <FaCreditCard /> },
    { name: "Voter ID Card", category: "Documents",title:"Apply for new Voter ID card or make corrections", icon: <FaVoteYea /> },
    { name: "Passport Apply", category: "Documents",title:"Apply for new passport or renewal", icon: <FaPassport /> },
    { name: "Electricity Bill", category: "Bills",title:"Pay electricity bills instantly and get receipt",icon: <FaBolt /> },
    { name: "Water Bill", category: "Bills",title:"Pay Water bills instantly and get receipt", icon: <FaWater /> },
    { name: "Income Certificatel", category: "Certificates",title:"Get income certificate for educational scholarships, loans, and government benefits", icon: <FaFileAlt /> },
    { name: "Caste Certificate", category: "Certificates",title:"Apply for SC/ST/OBC caste certificate for reservations and benefits", icon: <FaUserCheck /> },
    { name: "Domicile Certificate", category: "Certificates",title:"Get domicile certificate to prove permanent residency", icon: <FaHome /> },
    { name: "Birth Certificate", category: "Certificates",title:"Register birth and get birth certificate", icon:  <FaCertificate /> },
    { name: "Death Certificate", category: "Certificates",title:"Register death and obtain death certificate", icon:  <FaFileAlt /> },
    { name: "Ration Card", category: "Welfare Schemes",title:"Apply for new ration card or add/remove family members", icon:  <FaAddressCard /> },
  ];
 
  // FILTER + SEARCH LOGIC
    const filteredServices = services.filter((s) => {
    const matchCategory = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="font-sans bg-gray-100">
  
    {/* HERO */}
    <section
       className="text-white py-10 px-6 relative"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg?semt=ais_hybrid&w=740&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      >
        <div className="max-w-7xl mx-auto  grid md:grid-cols-2">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All Services
            </h1>
            <p className="mb-6 text-lg">
            सभी सेवाएं - Complete list of government services
            </p>
          </div>
        </div>
    </section>

    {/* SERVICES */}
    <section className="py-16 px-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 ">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service...(eg.,PAN,Aadhaar,Passport)"
                className="border px-4 py-3 rounded-lg w-full md:w-120 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            </div>

            {/* Category Buttons */}
            <div className="flex gap-3 mb-8 flex-wrap">
            {["All", "Documents", "Bills", "Certificates","Welfare Schemes"].map((cat) => (
                <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                >
                {cat}
                </button>
            ))}
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredServices.length > 0 ? (
                 filteredServices.map((s, i) => (
                <div
                    key={i}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer group relative"
                >
                    <span className="absolute top-3 right-3 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    {s.category}
                    </span>

                    <div className="text-3xl text-blue-600 mb-4 group-hover:scale-110 transition">
                    {s.icon}
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{s.name}</h3>

                    <p className="text-sm text-gray-500 mb-3">
                    {s.title}
                    </p>

                    <button className="text-blue-600 text-sm font-medium">
                    Apply Now →
                    </button>
                </div>
                ))
               ) : (
                <p className="text-center col-span-full text-gray-500">
                No services found 😔
                </p>
                )}
            </div>
    </section>
     {/* FOOTER */}
     <footer className="bg-blue-700 text-white text-center py-4">
        <p>© 2026 E-Mitra Portal</p>
      </footer>
    </div>
       
  );
}

export default Services;