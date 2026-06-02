"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaWhatsapp } from 'react-icons/fa';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Send, 
  Flame, 
  Heart, 
  Tent, 
  UtensilsCrossed, 
  Music, 
  Lightbulb, 
  PartyPopper,
  X,
  Play
} from 'lucide-react';

export default function Home() {
  // States
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [visiblePostsCount, setVisiblePostsCount] = useState(3);
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(9);
  
  // Contact form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Handle keyboard navigation for the lightbox slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxItem || !lightboxItem.images || lightboxItem.images.length <= 1) return;
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev === lightboxItem.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev === 0 ? lightboxItem.images.length - 1 : prev - 1));
      } else if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  // Fetch posts, gallery and hero slides on load
  useEffect(() => {
    fetchPosts();
    fetchGallery();
    fetchHeroSlides();
  }, []);

  // Reset gallery pagination when active category changes
  useEffect(() => {
    setVisibleGalleryCount(9);
  }, [activeFilter]);

  // Slideshow autoplay cycling effect
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data); // fetch all posts to support pagination on client
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const fetchHeroSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides');
      if (res.ok) {
        const data = await res.json();
        setHeroSlides(data);
      }
    } catch (err) {
      console.error("Error fetching hero slides:", err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  // Filter categories
  const categories = ['All', 'Wedding', 'Birthday', 'Tent', 'Catering', 'DJ & Sound', 'Lighting'];

  const filteredGallery = activeFilter === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeFilter);

  // Form submit handler
  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus({ submitting: false, success: true, error: null });
        setForm({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          message: ''
        });
      } else {
        setFormStatus({ submitting: false, success: false, error: data.error || 'Something went wrong' });
      }
    } catch (err) {
      setFormStatus({ submitting: false, success: false, error: 'Network error. Please try again.' });
    }
  };

  // Services list helper
  const services = [
    {
      title: "Wedding Decoration",
      description: "We design stunning wedding setups including mandap decoration, stage lighting, floral themes and luxury seating arrangements.",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Tent & Canopy Setup",
      description: "A collection of our finest tent decoration work, waterproof dome structures, and canopy arrangements for weddings and events.",
      icon: Tent,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Catering Services",
      description: "Exquisite culinary presentations, custom multi-cuisine menu options, and highly trained professional service staff.",
      icon: UtensilsCrossed,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "DJ & Sound Setup",
      description: "High fidelity professional acoustic systems, dynamic live audio management, and state-of-the-art DJ consoles.",
      icon: Music,
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Birthday Party Decoration",
      description: "Creative balloon decoration, customized themed backdrops, marquee letter setups, and party arrangements for kids and adults.",
      icon: PartyPopper,
      color: "from-teal-500 to-emerald-500"
    },
    {
      title: "Event Lighting",
      description: "Intelligent moving beam heads, structural ambient uplighting, fairy lights setups, and laser show synchronization.",
      icon: Lightbulb,
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <>
      <Navbar />

    {/* Hero Section */}
    <section id="home" className="relative min-h-[75vh] sm:min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      
      {/* Slideshow background images */}
      {heroSlides.length > 0 ? (
        <div className="absolute inset-0 z-0 select-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-100 ${
                activeSlideIndex === idx 
                  ? 'opacity-65 scale-100 filter saturate-100' 
                  : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            />
          ))}
          {/* Dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/50 to-cyber-dark/20" />
        </div>
      ) : (
        /* Fallback grid background */
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      )}
      
      {/* Glow grid mesh background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] z-1" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyber-purple/10 blur-[120px] animate-pulse-slow z-1" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] rounded-full bg-cyber-cyan/15 blur-[160px] animate-pulse-slow z-1" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-16 sm:pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 mb-6 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          Premier Event Planners in Palamau, Jharkhand
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          <span className="block font-cormorant italic text-white/95">
            {heroSlides[activeSlideIndex] && heroSlides[activeSlideIndex].caption 
              ? heroSlides[activeSlideIndex].caption.split('with')[0] || "Crafting Extraordinary"
              : "Crafting Extraordinary"}
          </span>
          <span className="block mt-3 bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-purple glow-text-cyan font-cinzel font-semibold tracking-widest uppercase text-xl sm:text-3xl md:text-4xl">
            {heroSlides[activeSlideIndex] && heroSlides[activeSlideIndex].caption 
              ? (heroSlides[activeSlideIndex].caption.split('with')[1] ? "with " + heroSlides[activeSlideIndex].caption.split('with')[1] : "Memories & Events")
              : "Memories & Events"}
          </span>
        </h1>
          
          <p className="hidden sm:block max-w-3xl mx-auto text-gray-400 text-lg sm:text-xl leading-relaxed mb-12">
            Sharma Events delivers luxury Wedding Decoration, robust Tent & Canopy setups, gourmet Catering, and concert-grade DJ Sound across Ramgarh, Chhattarpur, Palamau, and Jharkhand.
          </p>
          
          {/* Quick Direct Contacts (Icons only) */}
          <div className="mt-10 mb-8 flex justify-center items-center gap-4">
            <a 
              href="https://wa.me/917903967800" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3.5 rounded-xl bg-emerald-500/5 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/50 backdrop-blur-md transition-all duration-350 flex items-center justify-center shadow-lg shadow-emerald-500/5 scale-100 hover:scale-105 active:scale-95 cursor-pointer" 
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
            
            <a 
              href="https://www.instagram.com/sharmaevents2000?igsh=ZTlvN2ZqMGVyOHo3" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3.5 rounded-xl bg-pink-500/5 text-pink-400 border border-pink-500/25 hover:bg-pink-500/15 hover:text-pink-300 hover:border-pink-500/50 backdrop-blur-md transition-all duration-350 flex items-center justify-center shadow-lg shadow-pink-500/5 scale-100 hover:scale-105 active:scale-95 cursor-pointer" 
              title="Follow on Instagram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a 
              href="mailto:rahulsharma56291@gmail.com" 
              className="p-3.5 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/25 hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/50 backdrop-blur-md transition-all duration-355 flex items-center justify-center shadow-lg shadow-rose-500/5 scale-100 hover:scale-105 active:scale-95 cursor-pointer" 
              title="Send Email"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <a
              href="#contact"
              className="px-8 py-4 rounded-xl text-sm uppercase tracking-wider text-white font-bold cyber-button shadow-lg w-full sm:w-auto text-center"
            >
              Get In Touch
            </a>
            <a
              href="#services"
              className="px-8 py-4 rounded-xl text-sm uppercase tracking-wider text-gray-300 font-bold glass-panel hover:bg-white/10 hover:text-white border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Our Services
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-24">
            {[
            { num: "500+", label: "Successful Events" },
            { num: "10+", label: "Years Experience" },
            { num: "100+", label: "Client Satisfaction" },
            { num: "15+", label: "Event Services" }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl glass-panel relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-2">
                {stat.num}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Slider Controllers */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={() => setActiveSlideIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full glass-panel hover:bg-white/15 hover:text-white text-gray-400 transition-all focus:outline-none cursor-pointer hidden sm:block z-20 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveSlideIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full glass-panel hover:bg-white/15 hover:text-white text-gray-400 transition-all focus:outline-none cursor-pointer hidden sm:block z-20 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider bottom indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 select-none">
            {heroSlides.map((_, slideIdx) => (
              <button
                key={slideIdx}
                onClick={() => setActiveSlideIndex(slideIdx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlideIndex === slideIdx 
                    ? 'bg-cyber-cyan w-8' 
                    : 'bg-white/20 hover:bg-white/40 w-3'
                }`}
                aria-label={`Go to slide ${slideIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden bg-[#02050b]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-cyber-purple bg-cyber-purple/10 border border-cyber-purple/20">
                <Flame className="w-3.5 h-3.5 text-cyber-purple animate-pulse" />
                Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Designing Premium Events Across <span className="text-cyber-cyan">Jharkhand</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                Based in the heart of Jharkhand, **Sharma Events** specializes in crafting events that stand out. With deep operations in Ramgarh, Chhattarpur, Palamau, and neighboring regions, we handle everything from intimate birthdays to massive luxury weddings.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Our approach blends traditional hospitality with futuristic aesthetics. We own high-end waterproof tent infrastructure, modern catering setups, high-fidelity sound columns, and computerized intelligent light arrays. We don't just supply—we design.
              </p>
              <div className="pt-4 space-y-3.5">
                {[
                  "Complete, stress-free planning from scratch",
                  "Finest custom floral mandaps & stage decorations",
                  "Heavy-duty windproof canopy structures for major fests",
                  "Simulated menu tastings with our catering experts"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side graphical showcase */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-3xl glass-panel border border-white/10 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyber-cyan/10 blur-xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyber-purple/10 blur-xl" />
                
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Sharma Events?</h3>
                
                <div className="space-y-6">
                  {[
                    { title: "Localized Mastery", desc: "Unmatched execution network across Ramgarh, Chhattarpur, and Palamau, ensuring timely delivery.", color: "border-l-cyber-cyan" },
                    { title: "Premium Visuals", desc: "Cyber-inspired modern lighting and design elements that make your photos look stunning and professional.", color: "border-l-cyber-purple" },
                    { title: "Complete Logistics", desc: "We own all light, sound, tent, and catering assets directly, eliminating middleman markups and issues.", color: "border-l-cyber-pink" }
                  ].map((feat, i) => (
                    <div key={i} className={`border-l-4 ${feat.color} pl-4 space-y-1.5`}>
                      <h4 className="text-white font-semibold text-base">{feat.title}</h4>
                      <p className="text-gray-400 text-sm">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyber-cyan/5 blur-[160px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 mb-4">
              Our Expertise
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
              Our Professional Event Services
            </h2>
            <p className="text-gray-400">
              We design and coordinate full events, delivering modern, reliable, and spectacular service configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 rounded-2xl glass-panel glass-panel-hover flex flex-col items-start text-left"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${svc.color} text-white mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{svc.description}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyber-cyan uppercase tracking-wider hover:text-white transition-colors group/link"
                  >
                    Inquire Now
                    <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Posts (News / Updates) Section */}
      {posts.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-[#02050b]/80 border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyber-purple bg-cyber-purple/10 border border-cyber-purple/20 mb-4">
                  Updates
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Recent Events & Celebrations
                </h2>
              </div>
              <p className="text-gray-400 max-w-md text-sm">
                Get a look at our freshly completed setups, live video updates, and project diaries across Jharkhand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.slice(0, visiblePostsCount).map((post) => (
                <article 
                  key={post.id}
                  className="rounded-2xl overflow-hidden glass-panel border border-white/5 flex flex-col h-full group"
                >
                  <div className="relative h-56 bg-gray-900 overflow-hidden shrink-0">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-cyber-cyan flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {post.description}
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 text-xs font-bold text-cyber-purple uppercase tracking-wider hover:text-white transition-colors"
                    >
                      Book Similar Setup
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {posts.length > visiblePostsCount && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisiblePostsCount(prev => prev + 3)}
                  className="px-8 py-3.5 rounded-xl border border-cyber-purple/30 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white glass-panel hover:bg-white/10 hover:border-cyber-purple transition-all duration-350 cursor-pointer shadow-md"
                >
                  View More Celebrations
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section id="gallery" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-cyber-purple/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 mb-4">
              Portfolios
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
              Our Work Gallery
            </h2>
            <p className="text-gray-400">
              Browse images and configurations from our wedding decor, custom balloon backdrops, and heavy tent alignments.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple border-transparent text-white shadow-md shadow-cyber-cyan/20'
                    : 'glass-panel border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filteredGallery.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-2xl">
              <p className="text-gray-500">No images available for this category yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.slice(0, visibleGalleryCount).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setLightboxItem(item);
                      setActiveImageIndex(0);
                    }}
                    className="group relative rounded-2xl overflow-hidden glass-panel border border-white/5 cursor-pointer w-full aspect-video"
                  >
                    <img 
                      src={item.images?.[0] || ''} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-xs font-bold text-cyber-cyan uppercase tracking-wider mb-1.5">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-300 text-xs line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGallery.length > visibleGalleryCount && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setVisibleGalleryCount(prev => prev + 6)}
                    className="px-8 py-3.5 rounded-xl border border-cyber-cyan/30 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white glass-panel hover:bg-white/10 hover:border-cyber-cyan transition-all duration-350 cursor-pointer shadow-md"
                  >
                    View More Portfolios
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button 
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel hover:text-white text-gray-400 transition-colors focus:outline-none z-50 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="max-w-4xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[65vh] flex items-center justify-center rounded-2xl overflow-hidden glass-panel border border-white/10 group/slider">
              
              {/* Main Image */}
              <img 
                src={lightboxItem.images?.[activeImageIndex] || ''} 
                alt={lightboxItem.title} 
                className="max-w-full max-h-[65vh] object-contain select-none"
              />

              {/* Slider Arrows */}
              {lightboxItem.images && lightboxItem.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? lightboxItem.images.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 p-2.5 rounded-full glass-panel hover:bg-white/10 hover:text-white text-gray-400 transition-all focus:outline-none cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === lightboxItem.images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 p-2.5 rounded-full glass-panel hover:bg-white/10 hover:text-white text-gray-400 transition-all focus:outline-none cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Indicator Numbers */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white select-none">
                    <span>{activeImageIndex + 1} / {lightboxItem.images.length}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="text-center max-w-2xl px-4">
              <span className="text-xs font-bold text-cyber-cyan uppercase tracking-widest">
                {lightboxItem.category}
              </span>
              {lightboxItem.title && <h3 className="text-2xl font-bold text-white mt-1.5 mb-2">{lightboxItem.title}</h3>}
              {lightboxItem.description && <p className="text-gray-400 text-sm leading-relaxed">{lightboxItem.description}</p>}
              
              {/* Bottom Dot indicators for slideshow */}
              {lightboxItem.images && lightboxItem.images.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {lightboxItem.images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveImageIndex(dotIdx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeImageIndex === dotIdx 
                          ? 'bg-cyber-cyan w-4' 
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden bg-[#02050b]/80 border-t border-white/5">
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyber-pink/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyber-pink bg-cyber-pink/10 border border-cyber-pink/20 mb-4">
              Get in Touch
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
              Contact Sharma Events
            </h2>
            <p className="text-gray-400">
              Planning an event in Ramgarh, Chhattarpur, Palamau, or elsewhere in Jharkhand? Write to us, and we will get back with custom design plans.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
            
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-8">
                <h3 className="text-xl font-bold text-white">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan h-12 w-12 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Call Us</div>
                      <a href="tel:+917903967800" className="text-white hover:text-cyber-cyan text-base font-semibold transition-colors mt-1 block">
                        +91 79039 67800
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 h-12 w-12 flex items-center justify-center shrink-0">
                      <FaWhatsapp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">WhatsApp Us</div>
                      <a href="https://wa.me/917903967800" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 text-base font-semibold transition-colors mt-1 block">
                        +91 79039 67800
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 h-12 w-12 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Instagram</div>
                      <a href="https://www.instagram.com/sharmaevents2000?igsh=ZTlvN2ZqMGVyOHo3" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400 text-base font-semibold transition-colors mt-1 block">
                        @sharmaevents2000
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple h-12 w-12 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Email Us</div>
                      <a href="mailto:rahulsharma56291@gmail.com" className="text-white hover:text-cyber-purple text-base font-semibold transition-colors mt-1 block">
                        rahulsharma56291@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-cyber-pink/10 border border-cyber-pink/20 text-cyber-pink h-12 w-12 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Office Address</div>
                      <div className="text-white text-sm font-semibold mt-1 leading-relaxed">
                        Ramgarh, Chhattarpur, Palamau, Jharkhand - 822113
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-2xl glass-panel border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
                
                {formStatus.success ? (
                  <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex flex-col items-center text-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-500/20">
                      <Send className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-lg">Inquiry Sent Successfully!</h4>
                    <p className="text-sm">Thank you for contacting Sharma Events. We will get in touch with you shortly.</p>
                    <button 
                      onClick={() => setFormStatus({ submitting: false, success: false, error: null })}
                      className="mt-2 text-xs font-bold uppercase tracking-wider hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                          placeholder="e.g. Bikas Sharma"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                          placeholder="e.g. bikas@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                          placeholder="e.g. +91 99999 88888"
                        />
                      </div>
                      <div>
                        <label htmlFor="eventDate" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          Event Date
                        </label>
                        <input
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          value={form.eventDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        Event Requirements & Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        value={form.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                        placeholder="Detail your requirements (e.g. Mandap decoration setup, catering for 400 people...)"
                      />
                    </div>

                    {formStatus.error && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                        {formStatus.error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus.submitting}
                      className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider cyber-button disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {formStatus.submitting ? (
                        <>Sending Inquiries...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Embedded Google Map */}
          <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 p-2 shadow-2xl relative">
            <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-cyber-dark/80 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2 z-10">
              <MapPin className="w-4 h-4 text-cyber-cyan" />
              Service Area: Chhattarpur, Palamau
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.3758364121517!2d84.1852504!3d24.2635955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398c2579b90c3cfd%3A0xe54c7d0d02ad77bd!2sChhattarpur%2C%20Jharkhand%20822113!5e0!3m2!1sen!2sin!4v1717360000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '1.25rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
