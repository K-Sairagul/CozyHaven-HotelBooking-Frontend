import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, MapPin, Phone, Mail, Wifi, Car, Coffee, Utensils, Dumbbell, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HotelLanding = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate= useNavigate();

  // Hotel images from Google
  const hotelImages = [
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    // Auto-cycle images every 4 seconds
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(imageInterval);
    };
  }, [hotelImages.length]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400 tracking-widest">
            CozyHaven
          </div>
          
          <div className="flex gap-4">
           
<button 
  onClick={() => navigate('/login')}
  className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105"
>
  Login
</button>
<button 
  onClick={() => navigate('/register')}
  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
>
  Sign Up
</button>
          </div>
        </div>
      </header>

      {/* Hero Section with Image Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {hotelImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-110'
              }`}
            >
              <img
                src={image}
                alt={`Hotel view ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
            </div>
          ))}
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {hotelImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Hero Content - Moved to bottom center */}
        <div className={`absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <button className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-bold text-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/50 border-2 border-yellow-400">
              Book Your Stay
            </button>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <ChevronDown className="w-8 h-8 text-white/80" />
        </div>
      </section>

      {/* Features Section - Updated to 3 columns */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Premium Amenities
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Indulge in world-class facilities designed to exceed your expectations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Wifi, title: "High-Speed WiFi", desc: "Seamless connectivity throughout the property" },
              { icon: Car, title: "Valet Parking", desc: "Complimentary luxury car service" },
              { icon: Coffee, title: "24/7 Room Service", desc: "Gourmet dining at your fingertips" },
              { icon: Utensils, title: "Fine Dining", desc: "Michelin-starred restaurant experience" },
              { icon: Dumbbell, title: "Fitness Center", desc: "State-of-the-art equipment and personal training" },
              { icon: Waves, title: "Infinity Pool", desc: "Breathtaking views and relaxation" }
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm hover:from-yellow-400/10 hover:to-yellow-600/10 transition-all duration-500 transform hover:scale-105 border border-white/10">
                <feature.icon className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Showcase - Updated to 3 columns */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Our Suites
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Each room is a masterpiece of design and comfort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: "Presidential Suite", 
                price: "$2,500/night", 
                rating: 5,
                image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              { 
                name: "Ocean View Suite", 
                price: "$1,800/night", 
                rating: 5,
                image: "https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              { 
                name: "Garden Villa", 
                price: "$1,200/night", 
                rating: 4,
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              { 
                name: "Executive Room", 
                price: "$800/night", 
                rating: 4,
                image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              },
              { 
                name: "Deluxe Suite", 
                price: "$600/night", 
                rating: 4,
                image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              },
              { 
                name: "Standard Room", 
                price: "$400/night", 
                rating: 4,
                image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              }
            ].map((suite, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-yellow-400/20 hover:to-yellow-600/20 transition-all duration-500 transform hover:scale-105 border border-white/10">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={suite.image}
                    alt={suite.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{suite.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-semibold text-lg">{suite.price}</span>
                      <div className="flex">
                        {[...Array(suite.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-t from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Ready to experience luxury? Get in touch with our concierge team
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">Location</h3>
              <p className="text-white/70">123 Paradise Boulevard<br />Luxury District, City 12345</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <Phone className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">Phone</h3>
              <p className="text-white/70">+1 (555) 123-HOTEL<br />24/7 Concierge Service</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">Email</h3>
              <p className="text-white/70">reservations@grandeur.com<br />concierge@grandeur.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-4 tracking-widest">
            GRANDEUR
          </div>
          <p className="text-white/60">
            © 2025 Grandeur Hotel. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HotelLanding;