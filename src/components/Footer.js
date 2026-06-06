import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#02050c] border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-cyber-purple/5 blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-cyber-cyan/5 blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="h-9 w-9 sm:h-11 sm:w-11 relative transition-all duration-300 shrink-0 group-hover:scale-105">
                <img 
                  src="/sharma-logo.png" 
                  alt="Sharma Events Logo" 
                  className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                />
              </div>
              <span className="font-extrabold text-sm sm:text-xl lg:text-2xl tracking-wider text-white">
                SHARMA<span className="text-cyber-cyan">EVENTS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sharma Events is your partner in creating unforgettable memories. From luxurious weddings to stunning canopy setups, we design excellence.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/sharmaevents2000?igsh=ZTlvN2ZqMGVyOHo3" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-pink-500/5 text-pink-400 border border-pink-500/20 hover:bg-pink-500/15 hover:text-pink-300 hover:border-pink-500/40 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://wa.me/917903967800" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors flex items-center justify-center" aria-label="WhatsApp">
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-cyber-cyan pl-2">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-cyber-purple pl-2">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-white transition-colors">Wedding Decoration</li>
              <li className="hover:text-white transition-colors">Tent & Canopy Setup</li>
              <li className="hover:text-white transition-colors">Catering Services</li>
              <li className="hover:text-white transition-colors">DJ & Sound Setup</li>
              <li className="hover:text-white transition-colors">Birthday Party Decor</li>
              <li className="hover:text-white transition-colors">Event Lighting</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-cyber-pink pl-2">
              Find Us
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 text-cyber-pink shrink-0 mt-0.5" />
                <span>Ramgarh, Chhattarpur, Palamau, Jharkhand, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Phone className="w-4 h-4 text-cyber-cyan shrink-0" />
                <a href="tel:+917903967800" className="hover:text-white transition-colors">+91 79039 67800</a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <FaWhatsapp className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/917903967800" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 79039 67800 (WhatsApp)</a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Mail className="w-4 h-4 text-cyber-purple shrink-0" />
                <a href="mailto:rahulsharma56291@gmail.com" className="hover:text-white transition-colors">rahulsharma56291@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} <span className="text-gray-400">Sharma Events</span>. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Developed by:</span>
            <span className="text-gray-300 font-medium">Bikash Singh Chauhan</span>
            <div className="flex items-center gap-2 ml-1">
              <a
                href="https://www.instagram.com/bikash_singh_chauhan_01?igsh=MWR3dGhzaW54eXJhMA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://wa.me/919304870789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 hover:text-cyber-cyan transition-colors">sharmaevents.co.in</span>
            <span className="text-gray-600">|</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white text-gray-400 transition-colors uppercase font-semibold tracking-wider text-[10px]"
            >
              Back to Top
              <ArrowUp className="w-3 h-3 text-cyber-purple" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
