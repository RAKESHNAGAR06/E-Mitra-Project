import './App.css';
import { useState, useEffect } from "react";
import { FaIdCard, FaBolt, FaWater, FaCreditCard, FaPassport, FaVoteYea, FaFileAlt, FaHome, FaUserCheck, FaCertificate, FaClipboardList, FaUserShield, FaAddressCard } from "react-icons/fa";
import { ShieldCheck, Zap, CheckCircle, ChevronDown } from "lucide-react";

function Home() {

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  
  // API STATES
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // BACKEND API CALL
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services"); 
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);
  
  // Icon Mapping (Direct JSX return कर रहा है)
  const iconMap = {
    "FaIdCard": <FaIdCard />, "FaCreditCard": <FaCreditCard />, "FaBolt": <FaBolt />,
    "FaWater": <FaWater />, "FaPassport": <FaPassport />, "FaVoteYea": <FaVoteYea />,
    "FaFileAlt": <FaFileAlt />, "FaHome": <FaHome />, "FaUserCheck": <FaUserCheck />,
    "FaCertificate": <FaCertificate />, "FaAddressCard": <FaAddressCard />
  };

 

  // FILTER + SEARCH LOGIC
  const filteredServices = services.filter((s) => {
    const matchCategory = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });
  const uniqueServices = Object.values(
    filteredServices.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = curr;
      }
      return acc;
    }, {})
  );

  const [open, setOpen] = useState(null);

  const faqs = [
    { q: "How long does PAN card take?", a: "It usually takes 7-10 working days to process your PAN card." },
    { q: "Is my data secure?", a: "Yes, your data is fully encrypted and protected with high security." },
    { q: "Can I track my application?", a: "Yes, you can track your application status in real-time from dashboard." },
    { q: "What payment methods are available?", a: "We support UPI, Debit Card, Credit Card and Net Banking." }
  ];

  return (
    <div className="font-sans bg-gray-100">
  
      {/* HERO */}
      <section className="text-white py-20 px-6 relative" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg?semt=ais_hybrid&w=740&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Government Services in One Place</h1>
            <p className="mb-6 text-lg">Apply for documents, pay bills & track requests easily</p>
            <div className="flex gap-4">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-full shadow">Apply Now</button>
              <button className="bg-orange-600 px-6 py-3 rounded-full shadow">View Services</button>
            </div>
          </div>
          <div className="bg-white text-gray-700 p-6 rounded-3xl shadow-xl">
            <h3 className="font-bold text-blue-700 mb-4">Quick Access</h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2">Aadhar →</li>
              <li className="flex justify-between border-b pb-2">PAN Card →</li>
              <li className="flex justify-between border-b pb-2">Electricity Bill →</li>
              <li className="flex justify-between">Water Bill →</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
          <div><h2 className="text-2xl font-bold text-blue-700">10K+</h2><p className="text-gray-500">Users</p></div>
          <div><h2 className="text-2xl font-bold text-blue-700">50+</h2><p className="text-gray-500">Services</p></div>
          <div><h2 className="text-2xl font-bold text-blue-700">99%</h2><p className="text-gray-500">Success Rate</p></div>
          <div><h2 className="text-2xl font-bold text-blue-700">24/7</h2><p className="text-gray-500">Support</p></div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition"></div>
            <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-blue-600 to-orange-500">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="03.jpg" alt="about" className="w-full h-80 object-cover" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4">About Our Platform</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">We provide a one-stop solution for all government services like Aadhar, PAN Card, Bill Payments and more. Our platform is designed to make the process fast, secure and hassle-free for every citizen.</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3"><div className="text-green-500 text-xl">✔</div><p>Easy and user-friendly interface</p></div>
              <div className="flex items-start gap-3"><div className="text-green-500 text-xl">✔</div><p>100% secure data protection</p></div>
              <div className="flex items-start gap-3"><div className="text-green-500 text-xl">✔</div><p>Fast processing with real-time tracking</p></div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">Learn More →</button>
          </div>
        </div>
        <div className="mt-20 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ title: "Government Approved" }, { title: "Secure Platform" }, { title: "Fast Processing" }, { title: "24/7 Support" }].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"><h3 className="font-semibold text-blue-700">{item.title}</h3></div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
          {/* Header */}
        <h2 className="text-3xl font-bold">Popular Services</h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <p>लोकप्रिय सेवाएं - Quick access to most used services</p>
            <a 
              href="/Services" 
              className="inline-block mt-6 text-blue-600 font-medium  hover:text-orange-500 transition"
            >
              View All Services →
            </a>
          </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* FIX 2: Loading Skeleton Add Kiya */}
          {uniqueServices.length > 0 ? (
           uniqueServices.map((s) => (
              <div
                key={s._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {s.category}
                  </span>
                </div>

                <div className="p-5 flex-grow">
                  {/* FIX 1: getIcon(s.icon) हटाया और सीधा iconMap लगाया */}
                  <div className="text-blue-600 text-3xl mb-4">
                    {iconMap[s.icon] || <FaClipboardList />}
                  </div>

                  <h3 className="font-bold text-gray-800 text-base mb-1">
                    {s.name}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {s.title}
                  </p>
                </div>

                <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <span className="text-green-600 font-bold text-sm">₹
                    {s.price ? s.price : 'Free'}
                  </span>
                  
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
      </section>

      {/* HOW IT WORKS */}
      <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-4xl font-bold text-center mb-20">How It Works</h2>
        <div className="max-w-6xl mx-auto relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 -translate-y-1/2"></div>
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {[
              { icon: <FaClipboardList />, title: "Select Service", desc: "Browse and choose from available government services" },
              { icon: <FaUserShield />, title: "Fill Details", desc: "Provide accurate information with full security" },
              { icon: <CheckCircle />, title: "Get Service", desc: "Receive confirmation and service instantly" }
            ].map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold shadow-lg group-hover:scale-110 transition">{i + 1}</div>
                <div className="mt-10 p-[2px] rounded-3xl bg-gradient-to-r from-blue-600 to-orange-500 group-hover:shadow-2xl transition">
                  <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl">
                    <div className="text-4xl text-blue-600 mb-5 flex justify-center group-hover:scale-125 transition duration-300">{step.icon}</div>
                    <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    {i !== 2 && (<div className="hidden md:block absolute top-1/2 right-[-35px] text-blue-500 text-2xl animate-pulse">→</div>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">Why Choose e-Mitra?</h2>
          <p className="text-gray-500 mt-2">हमें क्यों चुनें? Your Trusted Government Service Partner</p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          {[
            { title: "100% Secure", desc: "Your data is safe with government-approved processes", color: "bg-blue-600", icon: "🛡️" },
            { title: "Fast Processing", desc: "Quick turnaround time for all services", color: "bg-orange-500", icon: "⏱️" },
            { title: "Expert Support", desc: "Trained professionals to assist you", color: "bg-green-600", icon: "👨‍💼" },
            { title: "Verified Services", desc: "All services are officially authorized", color: "bg-purple-600", icon: "📄" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`${item.color} w-16 h-16 flex items-center justify-center rounded-2xl text-white text-2xl shadow-md mb-4`}>{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS & FAQ & FOOTER (Same as yours) */}
      <section className="py-10 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3">What Our Users Say</h2>
          <p className="text-gray-500">Trusted by thousands of happy customers</p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[1,2,3].map((i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition"></div>
              <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-blue-600 to-orange-500">
                <div className="bg-white p-8 rounded-3xl shadow-md group-hover:shadow-2xl transition">
                  <div className="flex justify-center mb-4 text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
                  <p className="text-gray-600 text-sm text-center mb-6 italic">"Very fast and reliable service. Highly recommended for all government work!"</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold">U{i}</div>
                    <div className="text-left">
                      <h4 className="font-semibold">User {i}</h4>
                      <p className="text-xs text-gray-500">Rajasthan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 max-w-5xl mx-auto bg-gradient-to-r from-blue-700 to-orange-500 text-white rounded-3xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">10,000+ Happy Customers</h3>
          <p className="opacity-90">Join thousands of users who trust our platform daily</p>
        </div>
      </section>

      <section className="py-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500">Everything you need to know about our services</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition"></div>
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-blue-600 to-orange-500">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left">
                    <span className="font-semibold text-lg">{item.q}</span>
                    <ChevronDown className={`transition-transform ${open === i ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  <div className={`px-5 transition-all duration-300 ${open === i ? "max-h-40 pb-5" : "max-h-0 overflow-hidden"}`}>
                    <p className="text-gray-500 text-sm">{item.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">Contact Support</button>
        </div>
      </section>
    </div>
  );
}

export default Home;