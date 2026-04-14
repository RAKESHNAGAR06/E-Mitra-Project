import './App.css'
import { useState } from "react";
import { FaIdCard,FaBolt,FaWater,FaCreditCard,FaPassport,FaVoteYea,FaFileAlt, FaHome,FaUserCheck,FaCertificate,FaClipboardList,FaUserShield,FaAddressCard } from "react-icons/fa";
import { ShieldCheck, Zap, CheckCircle,ChevronDown } from "lucide-react";

function Home() {

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const services = [
    { name: "Aadhar", category: "Documents",title:"Update name, address, mobile number, or biometric details in Aadhaar", icon: <FaIdCard /> },
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
  const benefits = [
    {
      title: "Fast",
      icon: <Zap />,
      desc: "Quick processing with minimal wait time"
    },
    {
      title: "Secure",
      icon: <ShieldCheck />,
      desc: "Your data is protected with high security"
    },
    {
      title: "Reliable",
      icon: <CheckCircle />,
      desc: "Trusted service with high success rate"
    }
  ];
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
    {
      q: "How long does PAN card take?",
      a: "It usually takes 7-10 working days to process your PAN card."
    },
    {
      q: "Is my data secure?",
      a: "Yes, your data is fully encrypted and protected with high security."
    },
    {
      q: "Can I track my application?",
      a: "Yes, you can track your application status in real-time from dashboard."
    },
    {
      q: "What payment methods are available?",
      a: "We support UPI, Debit Card, Credit Card and Net Banking."
    }
  ];


  return (
    <div className="font-sans bg-gray-100">
  
    {/* HERO */}
    <section
       className="text-white py-20 px-6 relative"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg?semt=ais_hybrid&w=740&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Government Services in One Place
            </h1>
            <p className="mb-6 text-lg">
              Apply for documents, pay bills & track requests easily
            </p>
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
      <section className="py-12 bg-o">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">
            <div>
            <h2 className="text-2xl font-bold text-blue-700">10K+</h2>
            <p className="text-gray-500">Users</p>
            </div>
            <div>
            <h2 className="text-2xl font-bold text-blue-700">50+</h2>
            <p className="text-gray-500">Services</p>
            </div>
            <div>
            <h2 className="text-2xl font-bold text-blue-700">99%</h2>
            <p className="text-gray-500">Success Rate</p>
            </div>
            <div>
            <h2 className="text-2xl font-bold text-blue-700">24/7</h2>
            <p className="text-gray-500">Support</p>
            </div>
        </div>
    </section>
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT IMAGE / ILLUSTRATION */}
        <div className="relative group">

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition"></div>

          {/* Border */}
          <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-blue-600 to-orange-500">

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">

              <img
                src="03.jpg"
                alt="about"
                className="w-200 h-90 object-cover"
              />

            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div>

          <h2 className="text-4xl font-bold mb-4">
            About Our Platform
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We provide a one-stop solution for all government services like Aadhar, PAN Card, Bill Payments and more. 
            Our platform is designed to make the process fast, secure and hassle-free for every citizen.
          </p>

          {/* FEATURES */}
          <div className="space-y-4 mb-8">

            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✔</div>
              <p>Easy and user-friendly interface</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✔</div>
              <p>100% secure data protection</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-green-500 text-xl">✔</div>
              <p>Fast processing with real-time tracking</p>
            </div>

          </div>

          {/* CTA */}
          <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
            Learn More →
          </button>

        </div>

      </div>

      {/* EXTRA TRUST STRIP */}
      <div className="mt-20 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

        {[
          { title: "Government Approved" },
          { title: "Secure Platform" },
          { title: "Fast Processing" },
          { title: "24/7 Support" }
        ].map((item, i) => (

          <div key={i} className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-blue-700">
              {item.title}
            </h3>
          </div>

        ))}

      </div>

    </section>

    {/* SERVICES */}
      <section className="py-16 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <h2 className="text-3xl font-bold">Popular Services</h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <p>लोकप्रिय सेवाएं - Quick access to most used services</p>
            <a 
              href="#Services" 
              className="inline-block mt-6 text-blue-600 font-medium  hover:text-orange-500 transition"
            >
              View All Services →
            </a>
          </div>
        
    {/* Services Grid */}
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {uniqueServices.length > 0 ? (
    uniqueServices.map((s, i) => (
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

     {/* HOW IT WORKS */}
      <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-4xl font-bold text-center mb-20">
            How It Works
        </h2>

        <div className="max-w-6xl mx-auto relative">

            {/* LINE */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 -translate-y-1/2"></div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">

            {/* STEP */}
            {[
                {
                icon: <FaClipboardList />,
                title: "Select Service",
                desc: "Browse and choose from available government services"
                },
                {
                icon: <FaUserShield />,
                title: "Fill Details",
                desc: "Provide accurate information with full security"
                },
                {
                icon: <CheckCircle />,
                title: "Get Service",
                desc: "Receive confirmation and service instantly"
                }
            ].map((step, i) => (

                <div key={i} className="relative text-center group">

                {/* STEP NUMBER (FLOATING) */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold shadow-lg group-hover:scale-110 transition">
                    {i + 1}
                </div>

                {/* CARD */}
                <div className="mt-10 p-[2px] rounded-3xl bg-gradient-to-r from-blue-600 to-orange-500 group-hover:shadow-2xl transition">

                    <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl">

                    {/* ICON */}
                    <div className="text-4xl text-blue-600 mb-5 flex justify-center group-hover:scale-125 transition duration-300">
                        {step.icon}
                    </div>

                    {/* TITLE */}
                    <h3 className="font-semibold text-xl mb-3">
                        {step.title}
                    </h3>

                    {/* DESC */}
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {step.desc}
                    </p>

                    {/* ARROW */}
                    {i !== 2 && (
                        <div className="hidden md:block absolute top-1/2 right-[-35px] text-blue-500 text-2xl animate-pulse">
                        →
                        </div>
                    )}

                    </div>
                </div>

                </div>

            ))}

            </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-gray-100">
  
      {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">
            Why Choose e-Mitra?
          </h2>
          <p className="text-gray-500 mt-2">
            हमें क्यों चुनें? Your Trusted Government Service Partner
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

          {[
            {
              title: "100% Secure",
              desc: "Your data is safe with government-approved processes",
              color: "bg-blue-600",
              icon: "🛡️"
            },
            {
              title: "Fast Processing",
              desc: "Quick turnaround time for all services",
              color: "bg-orange-500",
              icon: "⏱️"
            },
            {
              title: "Expert Support",
              desc: "Trained professionals to assist you",
              color: "bg-green-600",
              icon: "👨‍💼"
            },
            {
              title: "Verified Services",
              desc: "All services are officially authorized",
              color: "bg-purple-600",
              icon: "📄"
            }
          ].map((item, i) => (

            <div key={i} className="flex flex-col items-center">
        
              {/* Icon Box */}
              <div className={`${item.color} w-16 h-16 flex items-center justify-center rounded-2xl text-white text-2xl shadow-md mb-4`}>
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm max-w-xs">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </section>

      <section className="py-10 bg-gradient-to-b from-white to-gray-50">

            {/* Heading */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-3">
                    What Our Users Say
                </h2>
                <p className="text-gray-500">
                    Trusted by thousands of happy customers
                </p>
            </div>

            {/* Cards */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

            {[1,2,3].map((i) => (
                <div key={i} className="relative group">

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition"></div>

                {/* Border */}
                <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-blue-600 to-orange-500">

                    {/* Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-md group-hover:shadow-2xl transition">

                    {/* Rating */}
                    <div className="flex justify-center mb-4 text-yellow-400 text-lg">
                        ⭐⭐⭐⭐⭐
                    </div>

                    {/* Text */}
                    <p className="text-gray-600 text-sm text-center mb-6 italic">
                        "Very fast and reliable service. Highly recommended for all government work!"
                    </p>

                    {/* User */}
                    <div className="flex items-center justify-center gap-3">

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold">
                        U{i}
                        </div>

                        {/* Info */}
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

            {/* Bottom Trust Strip */}
            <div className="mt-20 max-w-5xl mx-auto bg-gradient-to-r from-blue-700 to-orange-500 text-white rounded-3xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">
                10,000+ Happy Customers
            </h3>
            <p className="opacity-90">
                Join thousands of users who trust our platform daily
            </p>
            </div>

        </section>

        <section className="py-10">

            {/* Heading */}
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3">
                Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
                Everything you need to know about our services
            </p>
            </div>

            {/* FAQ LIST */}
            <div className="max-w-4xl mx-auto space-y-6">

            {faqs.map((item, i) => (
                <div key={i} className="group relative">

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition"></div>

                {/* Border */}
                <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-blue-600 to-orange-500">

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                    {/* Question */}
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full flex justify-between items-center p-5 text-left"
                    >
                        <span className="font-semibold text-lg">
                        {item.q}
                        </span>

                        <ChevronDown
                        className={`transition-transform ${
                            open === i ? "rotate-180 text-blue-600" : ""
                        }`}
                        />
                    </button>

                    {/* Answer */}
                    <div
                        className={`px-5 transition-all duration-300 ${
                        open === i ? "max-h-40 pb-5" : "max-h-0 overflow-hidden"
                        }`}
                    >
                        <p className="text-gray-500 text-sm">
                        {item.a}
                        </p>
                    </div>

                    </div>
                </div>

                </div>
            ))}

            </div>

            {/* Bottom CTA */}
            <div className="mt-20 text-center">
            <p className="text-gray-500 mb-4">
                Still have questions?
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
                Contact Support
            </button>
            </div>

        </section>

      {/* FOOTER */}
      <footer className="bg-blue-700 text-white text-center py-4">
        <p>© 2026 E-Mitra Portal</p>
      </footer>

    </div>
  );
}

export default Home;