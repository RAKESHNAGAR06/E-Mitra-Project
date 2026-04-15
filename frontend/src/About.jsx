import React from 'react';
import { FaUsers, FaClock,FaAward,FaUserCheck, FaCheckCircle, FaCogs,FaBullseye,FaShieldAlt, FaHeadset, FaBolt, FaLock, FaTag, FaComments } from 'react-icons/fa';

function About() { 
  // Cards Data
  const stats = [
    { 
      value: "50,000+", 
      label: "Happy Customers", 
      icon: FaUsers, 
      iconBg: "bg-blue-100", 
      iconColor: "text-blue-600" 
    },
    { 
      value: "5+", 
      label: "Years Experience", 
      icon: FaClock, 
      iconBg: "bg-orange-100", 
      iconColor: "text-orange-600" 
    },
    { 
      value: "99%", 
      label: "Success Rate", 
      icon: FaCheckCircle, 
      iconBg: "bg-green-100", 
      iconColor: "text-green-600" 
    },
    { 
      value: "12+", 
      label: "Services", 
      icon: FaCogs, 
      iconBg: "bg-purple-100", 
      iconColor: "text-purple-600" 
    },
  ];
// Card Data
const features = [
    {
      titleEn: "Authorized Center",
      titleHi: "अधिकृत केंद्र",
      description: "We are a government authorized e-Mitra center ensuring reliable and trustworthy services.",
      icon: FaShieldAlt,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      titleEn: "Expert Assistance",
      titleHi: "विशेषज्ञ सहायता",
      description: "Get help from trained professionals for all your documentation needs.",
      icon: FaHeadset,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      titleEn: "Fast Processing",
      titleHi: "तेज़ प्रसंस्करण",
      description: "Quick turnaround time for all applications with real-time status updates.",
      icon: FaBolt,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      titleEn: "Secure & Confidential",
      titleHi: "सुरक्षित और गोपनीय",
      description: "Your personal data is safe with us. We ensure 100% data privacy.",
      icon: FaLock,
      bgColor: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      titleEn: "Affordable Pricing",
      titleHi: "उचित मूल्य",
      description: "We charge minimal and genuine fees with no hidden costs.",
      icon: FaTag,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      titleEn: "Customer Support",
      titleHi: "ग्राहक सहायता",
      description: "Dedicated support team available to resolve all your queries.",
      icon: FaComments,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600"
    }
  ];

    const certifications = [
      {
        title: "Government Authorized",
        icon: FaShieldAlt,
        gradient: "from-blue-500 to-blue-700" // Blue Gradient
      },
      {
        title: "ISO Certified",
        icon: FaAward,
        gradient: "from-orange-500 to-orange-600" // Orange/Gold Gradient
      },
      {
        title: "Data Protection Compliant",
        icon: FaLock,
        gradient: "from-green-500 to-green-600" // Green Gradient
      },
      {
        title: "Customer Verified",
        icon: FaUserCheck,
        gradient: "from-purple-500 to-purple-600" // Purple Gradient
      }
    ];
  return (
<div className="w-full">
 {/* HERO SECTION - Exact Screenshot Style */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-6">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">About e-Mitra</h1>
          <p className="text-blue-200 mt-1 text-4">
            हमारे बारे में - Your Trusted Government Service Partner
          </p>
        </div>
      </div>

    <section className="bg-gray-50 py-16 md:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE - Text Content */}
          <div className="order-2 lg:order-1">
            {/* Subtitle */}
            <span className="inline-block text-sm font-semibold text-orange-600 uppercase tracking-wider mb-3">
              e-Mitra Digital Service Center
            </span>
            
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Making Government Services Accessible to All
            </h2>
            
            {/* Paragraphs */}
            <p className="text-gray-600 text-base leading-relaxed mb-5">
            e-Mitra Digital Service Center is committed to bridging the gap between citizens and government services. We provide a one-stop solution for all your government documentation needs, making bureaucratic processes simple and accessible.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-5">ई-मित्र डिजिटल सेवा केंद्र नागरिकों और सरकारी सेवाओं के बीच की खाई को पाटने के लिए प्रतिबद्ध है। हम आपकी सभी सरकारी दस्तावेज़ीकरण आवश्यकताओं के लिए वन-स्टॉप समाधान प्रदान करते हैं।</p>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
            With years of experience and thousands of satisfied customers, we have become the most trusted name in government service facilitation in our region.
            </p>
            
          </div>

          {/* RIGHT SIDE - Stats Cards Grid */}
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-5">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-start"
              >
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${stat.iconBg}`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                
                {/* Number */}
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                
                {/* Label */}
                <p className="text-gray-500 font-medium text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
    
    <section className="w-full bg-white py-10 md:py-10 px-4 sm:px-6 lg:px-8 font-['Segoe_UI',Arial,sans-serif]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-8 md:gap-10">
        
        {/* ===== LEFT CARD: OUR MISSION ===== */}
        <div className="flex-1 bg-[#eef6fc] rounded-2xl p-8 md:p-10 border border-[#dbeafe] shadow-sm flex flex-col">
          
          {/* Icon Container */}
          <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center mb-6 shadow-md shadow-blue-200">
            <FaBullseye className="text-white text-xl" />
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h3>

          {/* English Description */}
          <p className="text-gray-600 text-[15px] leading-relaxed mb-3">
            To provide seamless and accessible government services to every citizen through our digital platforms, ensuring transparency, efficiency, and convenience in all transactions.
          </p>

          {/* Hindi Description */}
          <p className="text-gray-500 text-sm leading-relaxed font-['Noto_Sans_Devanagari','Mangal',sans-serif]">
            प्रत्येक नागरिक तक डिजिटल प्लेटफॉर्म के माध्यम से सुलभ और पारदर्शी सरकारी सेवाएं प्रदान करना, जिससे सभी प्रक्रियाएं कुशल और सुविधाजनक हों।
          </p>

        </div>

        {/* ===== RIGHT CARD: OUR VISION ===== */}
        <div className="flex-1 bg-[#fdf8f0] rounded-2xl p-8 md:p-10 border border-[#fde68a]/50 shadow-sm flex flex-col">
          
          {/* Icon Container */}
          <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center mb-6 shadow-md shadow-orange-200">
            <FaShieldAlt className="text-white text-xl" />
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Our Vision
          </h3>

          {/* English Description */}
          <p className="text-gray-600 text-[15px] leading-relaxed mb-3">
            To become India's most trusted and widely used digital service platform, empowering citizens by bringing all essential government services under one roof.
          </p>

          {/* Hindi Description */}
          <p className="text-gray-500 text-sm leading-relaxed font-['Noto_Sans_Devanagari','Mangal',sans-serif]">
            भारत का सबसे विश्वसनीय और व्यापक रूप से उपयोग किया जाने वाला डिजिटल सेवा प्लेटफॉर्म बनना, जो नागरिकों को एक ही छत के नीचे सभी आवश्यक सरकारी सेवाएं प्रदान करे।
          </p>

        </div>

      </div>
    </section>

    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-500 font-medium">(आपका चुनाव?)</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100  group"
            >
              {/* Icon */}
              <div className={`w-16 h-16  mb-6 rounded-full ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>

              {/* Bilingual Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {feature.titleEn}
              </h3>
              <h4 className="text-sm font-medium text-orange-500 mb-4">
                 {feature.titleHi}
              </h4>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Our Certifications
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            हमारे प्रमाणपत्र और मान्यता
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {certifications.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group bg-gray-50 hover:bg-white"
            >
              {/* Gradient Icon Circle */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800">
                {item.title}
              </h3>
            </div>
          ))}

        </div>
      </div>
    </section>
 </div>
  );
};

export default About;