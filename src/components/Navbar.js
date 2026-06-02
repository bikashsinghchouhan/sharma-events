"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    if (pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else {
      // If we are on admin or other pages, navigate to home first, then scroll
      // Next.js router handles this, but simply linking to "/#section" works
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cyber-dark/85 backdrop-blur-md border-b border-white/5 py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 relative transition-all duration-300 shrink-0 group-hover:scale-105">
              <img 
                src="/sharma-logo.png" 
                alt="Sharma Events Logo" 
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
              />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400 group-hover:to-cyber-cyan transition-all duration-300">
              SHARMA<span className="text-cyber-cyan">EVENTS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-gray-300 hover:text-cyber-cyan font-medium text-sm transition-colors duration-200 tracking-wide uppercase"
              >
                {link.name}
              </a>
            ))}
            
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-white glass-panel hover:bg-white/10 border border-white/10 transition-all duration-300"
            >
              <Shield className="w-3.5 h-3.5 text-cyber-purple" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-1.5 rounded-lg glass-panel"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass-panel border-t border-white/5 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3 bg-cyber-dark/95 backdrop-blur-lg">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-cyber-cyan hover:bg-white/5 font-semibold tracking-wide uppercase text-sm"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-white/5">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30 hover:border-cyber-purple/50 transition-all"
            >
              <Shield className="w-4 h-4 text-cyber-purple" />
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
