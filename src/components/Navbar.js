"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';

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

  // Close mobile drawer on route changes
  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setIsOpen(false);
    }, 0);
    return () => { active = false; };
  }, [pathname]);


  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    <>
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 sm:h-15 sm:w-15 relative transition-all duration-300 shrink-0 group-hover:scale-105 flex items-center justify-center">
              <img 
                src="/sharma-logo.png" 
                alt="Sharma Events Logo" 
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
              />
            </div>
            <span className="font-extrabold text-sm sm:text-2xl lg:text-3xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400 group-hover:to-cyber-cyan transition-all duration-300">
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
    </nav>

      {/* Mobile Drawer Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#02050c]/95 backdrop-blur-xl border-l border-white/5 z-[70] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="h-12 w-12 relative transition-all duration-300 shrink-0 flex items-center justify-center">
              <img 
                src="/sharma-logo.png" 
                alt="Sharma Events Logo" 
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
              />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              SHARMA<span className="text-cyber-cyan">EVENTS</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white focus:outline-none p-1.5 rounded-lg glass-panel hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-8 flex flex-col space-y-2 overflow-y-auto">
          {navLinks.map((link, idx) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => {
                setIsOpen(false);
                handleNavClick(e, link.id);
              }}
              style={{ transitionDelay: isOpen ? `${idx * 50}ms` : '0ms' }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:text-cyber-cyan hover:bg-white/5 font-semibold tracking-wide uppercase text-sm border border-transparent hover:border-white/5 transition-all duration-300 ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-cyber-cyan/50" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30 hover:border-cyber-purple/50 transition-all shadow-md shadow-cyber-cyan/5"
          >
            <Shield className="w-4 h-4 text-cyber-purple" />
            Admin Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
