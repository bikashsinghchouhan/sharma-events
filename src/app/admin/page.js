"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  User, 
  Key, 
  LogOut, 
  MessageSquare, 
  FileImage, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  Link2, 
  ArrowLeft,
  Settings,
  RefreshCw,
  Sparkles,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Menu,
  X
} from 'lucide-react';

export default function Admin() {
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, posts, gallery, messages
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // New Post Form State
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    file: null
  });
  const [postSubmitting, setPostSubmitting] = useState(false);

  // New Gallery Item Form State
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    imageUrlsText: '',
    category: 'Wedding',
    files: []
  });
  const [gallerySubmitting, setGallerySubmitting] = useState(false);

  // Replace/Edit Image State
  const [replacingItemId, setReplacingItemId] = useState(null);
  const [replaceFiles, setReplaceFiles] = useState([]);
  const [replaceMode, setReplaceMode] = useState('overwrite'); // 'overwrite' or 'append'
  const [replaceSubmitting, setReplaceSubmitting] = useState(false);

  // Hero Slideshow Management State
  const [slides, setSlides] = useState([]);
  const [slideForm, setSlideForm] = useState({
    imageUrl: '',
    caption: '',
    order: 0,
    file: null
  });
  const [slideSubmitting, setSlideSubmitting] = useState(false);

  // Edit State variables
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostForm, setEditPostForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    file: null
  });

  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editGalleryForm, setEditGalleryForm] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    images: []
  });

  const [editingSlideId, setEditingSlideId] = useState(null);
  const [editSlideForm, setEditSlideForm] = useState({
    caption: '',
    order: 0,
    imageUrl: '',
    file: null
  });

  // Check login on load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Fetch dashboard data if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.error("Auth check failed", err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        router.push('/');
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [postsRes, galleryRes, messagesRes, slidesRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/gallery'),
        fetch('/api/messages'),
        fetch('/api/hero-slides')
      ]);

      if (postsRes.ok) setPosts(await postsRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (slidesRes.ok) setSlides(await slidesRes.json());
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoadingData(false);
    }
  };

  // File Upload Helper
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'File upload failed');
    }
    
    const data = await res.json();
    return data.url;
  };

  // Add Recent Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostSubmitting(true);

    try {
      let finalMediaUrl = postForm.mediaUrl;

      if (postForm.file) {
        finalMediaUrl = await uploadFile(postForm.file);
      }

      if (!finalMediaUrl) {
        alert("Please upload a file or enter a media URL.");
        setPostSubmitting(false);
        return;
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postForm.title,
          description: postForm.description,
          mediaUrl: finalMediaUrl,
          mediaType: postForm.mediaType
        })
      });

      if (res.ok) {
        setPostForm({ title: '', description: '', mediaUrl: '', mediaType: 'image', file: null });
        fetchDashboardData();
        alert("Event post created successfully!");
      } else {
        const data = await res.json();
        alert("Error creating post: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setPostSubmitting(false);
    }
  };

  // Add Gallery Item
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setGallerySubmitting(true);

    try {
      let finalImages = [];

      // Handle files upload
      if (galleryForm.files && galleryForm.files.length > 0) {
        const uploadPromises = galleryForm.files.map(file => uploadFile(file));
        finalImages = await Promise.all(uploadPromises);
      } else if (galleryForm.imageUrlsText) {
        finalImages = galleryForm.imageUrlsText
          .split(',')
          .map(u => u.trim())
          .filter(Boolean);
      }

      if (finalImages.length === 0) {
        alert("Please upload at least one image file or enter a URL.");
        setGallerySubmitting(false);
        return;
      }

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: galleryForm.title,
          description: galleryForm.description,
          images: finalImages,
          category: galleryForm.category
        })
      });

      if (res.ok) {
        setGalleryForm({ title: '', description: '', imageUrlsText: '', category: 'Wedding', files: [] });
        fetchDashboardData();
        alert("Gallery item added successfully!");
      } else {
        const data = await res.json();
        alert("Error creating gallery item: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setGallerySubmitting(false);
    }
  };

  // Replace Gallery Image (Instant replace/append feature)
  const handleImageReplaceSubmit = async (e, itemId, itemExistingImages) => {
    e.preventDefault();
    if (replaceFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }
    setReplaceSubmitting(true);

    try {
      // Upload all selected files
      const uploadPromises = replaceFiles.map(file => uploadFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      let finalImages = [];
      if (replaceMode === 'overwrite') {
        finalImages = uploadedUrls;
      } else {
        finalImages = [...itemExistingImages, ...uploadedUrls];
      }
      
      const res = await fetch(`/api/gallery/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: finalImages })
      });

      if (res.ok) {
        setReplaceFiles([]);
        setReplacingItemId(null);
        fetchDashboardData();
        alert(replaceMode === 'overwrite' ? "Gallery images replaced successfully!" : "Images added to gallery successfully!");
      } else {
        const data = await res.json();
        alert("Error saving images: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setReplaceSubmitting(false);
    }
  };

  // Add Hero Slide
  const handleSlideSubmit = async (e) => {
    e.preventDefault();
    setSlideSubmitting(true);

    try {
      let finalImageUrl = slideForm.imageUrl;

      if (slideForm.file) {
        finalImageUrl = await uploadFile(slideForm.file);
      }

      if (!finalImageUrl) {
        alert("Please upload an image file or enter a URL.");
        setSlideSubmitting(false);
        return;
      }

      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          caption: slideForm.caption,
          order: slideForm.order
        })
      });

      if (res.ok) {
        setSlideForm({ imageUrl: '', caption: '', order: 0, file: null });
        fetchDashboardData();
        alert("Hero slide added successfully!");
      } else {
        const data = await res.json();
        alert("Error adding slide: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSlideSubmitting(false);
    }
  };

  // Delete Hero Slide
  const handleDeleteSlide = async (id) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert("Failed to delete slide: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete Post
  const handleDeletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Update Recent Post
  const handlePostUpdate = async (e, id) => {
    e.preventDefault();
    setPostSubmitting(true);

    try {
      let finalMediaUrl = editPostForm.mediaUrl;

      if (editPostForm.file) {
        finalMediaUrl = await uploadFile(editPostForm.file);
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editPostForm.title,
          description: editPostForm.description,
          mediaUrl: finalMediaUrl,
          mediaType: editPostForm.mediaType
        })
      });

      if (res.ok) {
        setEditingPostId(null);
        fetchDashboardData();
        alert("Post updated successfully!");
      } else {
        const data = await res.json();
        alert("Error updating post: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setPostSubmitting(false);
    }
  };

  // Update Gallery Item Details
  const handleGalleryUpdate = async (e, id) => {
    e.preventDefault();
    setGallerySubmitting(true);

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editGalleryForm.title,
          description: editGalleryForm.description,
          category: editGalleryForm.category,
          images: editGalleryForm.images
        })
      });

      if (res.ok) {
        setEditingGalleryId(null);
        fetchDashboardData();
        alert("Gallery details updated successfully!");
      } else {
        const data = await res.json();
        alert("Error updating gallery details: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setGallerySubmitting(false);
    }
  };

  // Update Hero Slide
  const handleSlideUpdate = async (e, id) => {
    e.preventDefault();
    setSlideSubmitting(true);

    try {
      let finalImageUrl = editSlideForm.imageUrl;

      if (editSlideForm.file) {
        finalImageUrl = await uploadFile(editSlideForm.file);
      }

      const res = await fetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          caption: editSlideForm.caption,
          order: editSlideForm.order
        })
      });

      if (res.ok) {
        setEditingSlideId(null);
        fetchDashboardData();
        alert("Hero slide updated successfully!");
      } else {
        const data = await res.json();
        alert("Error updating slide: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSlideSubmitting(false);
    }
  };

  // Categories helper
  const galleryCategories = ['Wedding', 'Birthday', 'Tent', 'Catering', 'DJ & Sound', 'Lighting', 'Other'];

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-cyber-cyan animate-spin" />
          <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase">Checking Authentication...</p>
        </div>
      </div>
    );
  }

  // Not Logged In - Render Futuristic Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyber-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Gradients */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyber-purple/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-cyan/5 blur-[100px]" />

        <Link href="/" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white glass-panel hover:bg-white/10 border border-white/5 transition-all mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Website
        </Link>

        <div className="w-full max-w-md glass-panel border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyber-cyan/5 blur-lg" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-cyber-purple/5 blur-lg" />
          
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="h-16 w-16 relative transition-all duration-300 shrink-0 mb-4 hover:scale-105">
              <img 
                src="/sharma-logo.png" 
                alt="Sharma Events Logo" 
                className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
              />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              ADMIN<span className="text-cyber-cyan">PANEL</span>
            </h1>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">Sharma Events Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl glass-input text-sm"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider cyber-button cursor-pointer"
            >
              {loginSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged In - Dashboard Interface
  return (
    <div className="min-h-screen bg-[#02050b] text-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="flex md:hidden items-center justify-between px-6 py-4 bg-[#030712] border-b border-white/5 sticky top-0 z-30">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 relative shrink-0">
            <img 
              src="/sharma-logo.png" 
              alt="Sharma Events Logo" 
              className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
            />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white">
            SHARMA<span className="text-cyber-cyan">EVENTS</span>
          </span>
        </Link>
        <button
          onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
          className="text-gray-300 hover:text-white focus:outline-none p-1.5 rounded-lg glass-panel hover:bg-white/10 transition-colors"
        >
          {isAdminMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isAdminMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsAdminMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-80 max-w-[85vw] md:w-64 border-r border-white/5 bg-[#030712] shrink-0 p-6 flex flex-col justify-between gap-8 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isAdminMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsAdminMenuOpen(false)}>
              <div className="h-8 w-8 sm:h-10 sm:w-10 relative transition-all duration-300 shrink-0 group-hover:scale-105">
                <img 
                  src="/sharma-logo.png" 
                  alt="Sharma Events Logo" 
                  className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                />
              </div>
              <span className="font-extrabold text-sm sm:text-lg tracking-wider text-white">
                SHARMA<span className="text-cyber-cyan">EVENTS</span>
              </span>
            </Link>
            <button
              onClick={() => setIsAdminMenuOpen(false)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none p-1 rounded-lg glass-panel hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Settings },
              { id: 'posts', label: 'Recent Posts', icon: FileText },
              { id: 'gallery', label: 'Gallery Items', icon: FileImage },
              { id: 'slideshow', label: 'Hero Slideshow', icon: Sparkles },
              { id: 'messages', label: 'Contact Messages', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsAdminMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-purple/15 border-l-4 border-cyber-cyan text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* User / Logout */}
        <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center font-bold text-white text-sm shadow">
              A
            </div>
            <div>
              <div className="text-sm font-bold text-white">Administrator</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">sharmaevents</div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAdminMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-rose-500/5 hover:bg-rose-500/5 text-gray-400 hover:text-rose-400 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-extrabold text-white capitalize tracking-wide">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : `${activeTab} Management`}
            </h2>
            <p className="text-gray-400 text-xs mt-1">Manage event layouts, posts, gallery, and emails</p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loadingData}
            className="p-2.5 rounded-xl glass-panel text-gray-400 hover:text-white transition-all focus:outline-none flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {loadingData && posts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-cyber-purple animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Refreshing dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Tab: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10">
                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Recent Posts", count: posts.length, icon: FileText, tabId: "posts", color: "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20" },
                    { title: "Gallery Photos", count: gallery.length, icon: FileImage, tabId: "gallery", color: "text-cyber-purple bg-cyber-purple/10 border-cyber-purple/20" },
                    { title: "Hero Slides", count: slides.length, icon: Sparkles, tabId: "slideshow", color: "text-cyber-pink bg-cyber-pink/10 border-cyber-pink/20" },
                    { title: "Contact Messages", count: messages.length, icon: MessageSquare, tabId: "messages", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={i} 
                        onClick={() => setActiveTab(stat.tabId)}
                        className="p-6 rounded-2xl glass-panel border border-white/5 flex justify-between items-center cursor-pointer hover:border-white/20 transition-all"
                      >
                        <div className="space-y-1">
                          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{stat.title}</h4>
                          <div className="text-4xl font-extrabold text-white">{stat.count}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${stat.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Inquiries Panel */}
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white text-base">Latest Contact Messages</h3>
                      <button onClick={() => setActiveTab('messages')} className="text-xs text-cyber-cyan hover:underline uppercase font-bold tracking-wider">
                        View All
                      </button>
                    </div>

                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4">No contact messages received yet.</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {messages.slice(0, 3).map((msg) => (
                          <div key={msg.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-bold text-white text-sm">{msg.name}</span>
                                <span className="text-gray-500 text-[10px] ml-2 font-mono">({msg.email})</span>
                              </div>
                              <span className="text-[10px] text-gray-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</span>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed bg-white/2 p-2.5 rounded-lg border border-white/5">
                              "{msg.message}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick System Info */}
                  <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
                    <h3 className="font-bold text-white text-base">System Settings</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2 text-gray-400">
                        <span>Domain URL:</span>
                        <span className="text-white font-mono">sharmaevents.co.in</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2 text-gray-400">
                        <span>Persistence Tier:</span>
                        <span className="text-white font-mono">Local File System (JSON)</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2 text-gray-400">
                        <span>Media Uploads:</span>
                        <span className="text-white font-mono">/public/uploads/</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2 text-gray-400">
                        <span>SMTP Email:</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Simulation Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Recent Posts Manager */}
            {activeTab === 'posts' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form column */}
                <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyber-cyan" />
                    Add Recent Event Post
                  </h3>

                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Title *</label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. Wedding Setup at Ramgarh"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Description *</label>
                      <textarea
                        required
                        rows="3"
                        value={postForm.description}
                        onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="Detail the services and layout setup..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Media File (Upload) *</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-white/10 bg-white/2 hover:bg-white/5 cursor-pointer text-center text-xs text-gray-400 hover:text-white transition-all">
                          <Upload className="w-5 h-5 mb-1.5 text-cyber-cyan" />
                          <span>{postForm.file ? postForm.file.name : 'Select image/video file'}</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setPostForm({ ...postForm, file: e.target.files[0], mediaUrl: '' });
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1.5 pl-1">
                        Recommended size: 800x600px (4:3), format: JPG/PNG, size limit: 3MB
                      </p>
                    </div>

                    <div className="text-center text-gray-500 text-xs py-1">OR</div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Media URL</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Link2 className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          value={postForm.mediaUrl}
                          onChange={(e) => setPostForm({ ...postForm, mediaUrl: e.target.value, file: null })}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs"
                          placeholder="Or paste external Unsplash/video URL"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Media Type</label>
                      <select
                        value={postForm.mediaType}
                        onChange={(e) => setPostForm({ ...postForm, mediaType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      >
                        <option value="image" className="bg-[#030712] text-white">Image</option>
                        <option value="video" className="bg-[#030712] text-white">Video</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={postSubmitting}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider cyber-button cursor-pointer disabled:opacity-50"
                    >
                      {postSubmitting ? 'Uploading & Creating...' : 'Publish Post'}
                    </button>
                  </form>
                </div>

                {/* List column */}
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="font-bold text-white text-base">Published Posts List</h3>
                  
                  {posts.length === 0 ? (
                    <div className="p-8 text-center glass-panel rounded-2xl text-gray-500">
                      No posts published yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        editingPostId === post.id ? (
                          <div key={post.id} className="p-4 rounded-xl glass-panel border border-cyber-cyan/35 space-y-4">
                            <div className="text-xs font-bold uppercase text-cyber-cyan tracking-wider">Edit Post Details</div>
                            <form onSubmit={(e) => handlePostUpdate(e, post.id)} className="space-y-3">
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Title *</label>
                                <input
                                  type="text"
                                  required
                                  value={editPostForm.title}
                                  onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Description *</label>
                                <textarea
                                  required
                                  rows="2"
                                  value={editPostForm.description}
                                  onChange={(e) => setEditPostForm({ ...editPostForm, description: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Media Type</label>
                                <select
                                  value={editPostForm.mediaType}
                                  onChange={(e) => setEditPostForm({ ...editPostForm, mediaType: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                >
                                  <option value="image" className="bg-[#030712] text-white">Image</option>
                                  <option value="video" className="bg-[#030712] text-white">Video</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Media File (Upload New)</label>
                                <label className="flex items-center gap-2 px-3 py-2 rounded-lg glass-panel hover:bg-white/5 border border-white/10 cursor-pointer text-xs text-gray-400 hover:text-white transition-all">
                                  <Upload className="w-4 h-4 text-cyber-cyan" />
                                  <span className="truncate">{editPostForm.file ? editPostForm.file.name : "Choose new image/video..."}</span>
                                  <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        setEditPostForm({ ...editPostForm, file: e.target.files[0], mediaUrl: "" });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-500 text-center">OR</div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Media URL</label>
                                <input
                                  type="text"
                                  value={editPostForm.mediaUrl}
                                  onChange={(e) => setEditPostForm({ ...editPostForm, mediaUrl: e.target.value, file: null })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div className="flex gap-2 justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingPostId(null)}
                                  className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={postSubmitting}
                                  className="px-4 py-1.5 rounded-lg bg-cyber-cyan text-white text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                                >
                                  {postSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <div key={post.id} className="p-4 rounded-xl glass-panel border border-white/5 flex gap-4 items-start">
                            <div className="w-24 h-20 rounded-lg bg-gray-900 overflow-hidden shrink-0">
                              <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-white text-sm truncate">{post.title}</h4>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingPostId(post.id);
                                      setEditPostForm({
                                        title: post.title,
                                        description: post.description,
                                        mediaUrl: post.mediaUrl,
                                        mediaType: post.mediaType,
                                        file: null
                                      });
                                    }}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
                                    title="Edit details"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title="Delete post"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-1 mb-2">
                                {post.description}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                                <span>{post.date}</span>
                                <span className="text-white/10">|</span>
                                <span className="uppercase text-cyber-purple font-semibold">{post.mediaType}</span>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Gallery Manager */}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form column */}
                <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyber-cyan" />
                    Add Gallery Item
                  </h3>

                  <form onSubmit={handleGallerySubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Category *</label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      >
                        {galleryCategories.map((c) => (
                          <option key={c} value={c} className="bg-[#030712] text-white">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Title (Optional)</label>
                      <input
                        type="text"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. Traditional Mandap Decor"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Description (Optional)</label>
                      <textarea
                        rows="2"
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="Describe this gallery snapshot..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Image Files (Upload Multiple) *</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-white/10 bg-white/2 hover:bg-white/5 cursor-pointer text-center text-xs text-gray-400 hover:text-white transition-all">
                          <Upload className="w-5 h-5 mb-1.5 text-cyber-cyan" />
                          <span>
                            {galleryForm.files && galleryForm.files.length > 0 
                              ? `${galleryForm.files.length} file(s) selected` 
                              : 'Select one or multiple images'}
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                setGalleryForm({ 
                                  ...galleryForm, 
                                  files: Array.from(e.target.files), 
                                  imageUrlsText: '' 
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1.5 pl-1">
                        Recommended size: 1200x800px (3:2), format: JPG/PNG, size limit: 3MB
                      </p>
                    </div>

                    <div className="text-center text-gray-500 text-xs py-1">OR</div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Image URLs (Comma separated)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Link2 className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          value={galleryForm.imageUrlsText}
                          onChange={(e) => setGalleryForm({ ...galleryForm, imageUrlsText: e.target.value, files: [] })}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs"
                          placeholder="Paste URLs separated by commas (e.g. url1, url2)"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={gallerySubmitting}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider cyber-button cursor-pointer disabled:opacity-50"
                    >
                      {gallerySubmitting ? 'Uploading & Creating...' : 'Add Gallery Item'}
                    </button>
                  </form>
                </div>

                {/* List column */}
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="font-bold text-white text-base">Gallery Items List</h3>
                  
                  {gallery.length === 0 ? (
                    <div className="p-8 text-center glass-panel rounded-2xl text-gray-500">
                      No gallery items found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gallery.map((item) => (
                        editingGalleryId === item.id ? (
                          <div key={item.id} className="p-4 rounded-xl glass-panel border border-cyber-cyan/35 space-y-4">
                            <div className="text-xs font-bold uppercase text-cyber-cyan tracking-wider">Edit Gallery Item Details</div>
                            <form onSubmit={(e) => handleGalleryUpdate(e, item.id)} className="space-y-3">
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Category *</label>
                                <select
                                   value={editGalleryForm.category}
                                   onChange={(e) => setEditGalleryForm({ ...editGalleryForm, category: e.target.value })}
                                   className="w-full px-3 py-2 rounded-lg glass-input text-xs text-white"
                                 >
                                   {galleryCategories.map((c) => (
                                     <option key={c} value={c} className="bg-[#030712] text-white">{c}</option>
                                   ))}
                                 </select>
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Title</label>
                                <input
                                  type="text"
                                  value={editGalleryForm.title}
                                  onChange={(e) => setEditGalleryForm({ ...editGalleryForm, title: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                  rows="2"
                                  value={editGalleryForm.description}
                                  onChange={(e) => setEditGalleryForm({ ...editGalleryForm, description: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div className="flex gap-2 justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingGalleryId(null)}
                                  className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={gallerySubmitting}
                                  className="px-4 py-1.5 rounded-lg bg-cyber-cyan text-white text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                                >
                                  {gallerySubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <div key={item.id} className="p-4 rounded-xl glass-panel border border-white/5 space-y-4">
                            <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden group">
                              <img src={item.images?.[0] || ''} alt={item.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold uppercase tracking-wider text-cyber-cyan">
                                {item.category}
                              </span>
                              
                              {/* Replace Overlay Button */}
                              <button
                                onClick={() => {
                                  setReplacingItemId(replacingItemId === item.id ? null : item.id);
                                  setReplaceFiles([]);
                                }}
                                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                              >
                                <Upload className="w-4 h-4 text-cyber-cyan" />
                                Manage Images ({item.images?.length || 0})
                              </button>
                            </div>

                            {/* Preview of all images in the item */}
                            {item.images && item.images.length > 0 && (
                              <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
                                {item.images.map((img, imgIdx) => (
                                  <img 
                                    key={imgIdx} 
                                    src={img} 
                                    alt="" 
                                    className="w-9 h-9 object-cover rounded border border-white/10 shrink-0" 
                                  />
                                ))}
                              </div>
                            )}
   
                            {/* Inline Image Replacement Form */}
                            {replacingItemId === item.id && (
                              <form 
                                onSubmit={(e) => handleImageReplaceSubmit(e, item.id, item.images || [])}
                                className="p-4 bg-white/2 rounded-lg border border-cyber-cyan/35 space-y-4"
                              >
                                <div className="text-xs font-bold uppercase text-cyber-cyan tracking-wider">Manage Images (Upload)</div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setReplaceMode('overwrite')}
                                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                      replaceMode === 'overwrite'
                                        ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow shadow-cyber-cyan/20'
                                        : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                                    }`}
                                  >
                                    Replace All
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setReplaceMode('append')}
                                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                      replaceMode === 'append'
                                        ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow shadow-cyber-purple/20'
                                        : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                                    }`}
                                  >
                                    Add More
                                  </button>
                                </div>

                                <div className="flex gap-2">
                                  <label className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg glass-panel hover:bg-white/5 border border-white/10 cursor-pointer text-xs text-gray-400 hover:text-white transition-all min-w-0">
                                    <Upload className="w-4 h-4 shrink-0 text-cyber-cyan" />
                                    <span className="truncate">
                                      {replaceFiles.length > 0 
                                        ? `${replaceFiles.length} selected` 
                                        : 'Choose file(s)...'}
                                    </span>
                                    <input 
                                      type="file" 
                                      multiple
                                      accept="image/*" 
                                      className="hidden" 
                                      onChange={(e) => {
                                        if (e.target.files) setReplaceFiles(Array.from(e.target.files));
                                      }}
                                    />
                                  </label>
                                  <button 
                                    type="submit"
                                    disabled={replaceSubmitting}
                                    className="px-3 rounded-lg bg-cyber-cyan text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                                  >
                                    {replaceSubmitting ? 'Uploading...' : 'Save'}
                                  </button>
                                </div>
                              </form>
                            )}

                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-white text-sm truncate">{item.title || 'Untitled Snapshot'}</h4>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingGalleryId(item.id);
                                      setEditGalleryForm({
                                        title: item.title || '',
                                        description: item.description || '',
                                        category: item.category,
                                        images: item.images || []
                                      });
                                    }}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
                                    title="Edit details"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGalleryItem(item.id)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title="Delete item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Hero Slideshow Manager */}
            {activeTab === 'slideshow' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form column */}
                <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyber-cyan" />
                    Add Slideshow Slide
                  </h3>

                  <form onSubmit={handleSlideSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Caption / Heading Text</label>
                      <input
                        type="text"
                        value={slideForm.caption}
                        onChange={(e) => setSlideForm({ ...slideForm, caption: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. Creating Unforgettable Celebrations with Elegant Decorations"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Display Order</label>
                      <input
                        type="number"
                        value={slideForm.order}
                        onChange={(e) => setSlideForm({ ...slideForm, order: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. 1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Slide Image (Upload) *</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-white/10 bg-white/2 hover:bg-white/5 cursor-pointer text-center text-xs text-gray-400 hover:text-white transition-all">
                          <Upload className="w-5 h-5 mb-1.5 text-cyber-cyan" />
                          <span>{slideForm.file ? slideForm.file.name : 'Select slide image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setSlideForm({ ...slideForm, file: e.target.files[0], imageUrl: '' });
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1.5 pl-1">
                        Recommended size: 1920x1080px (16:9), format: JPG/PNG, size limit: 5MB
                      </p>
                    </div>

                    <div className="text-center text-gray-500 text-xs py-1">OR</div>

                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Slide Image URL</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Link2 className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          value={slideForm.imageUrl}
                          onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value, file: null })}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs"
                          placeholder="Or paste external Unsplash image URL"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={slideSubmitting}
                      className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider cyber-button cursor-pointer disabled:opacity-50"
                    >
                      {slideSubmitting ? 'Uploading & Adding...' : 'Add Slide'}
                    </button>
                  </form>
                </div>

                {/* List column */}
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="font-bold text-white text-base">Hero Slideshow Slides</h3>
                  
                  {slides.length === 0 ? (
                    <div className="p-8 text-center glass-panel rounded-2xl text-gray-500">
                      No slides found. Using defaults.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {slides.map((slide) => (
                        editingSlideId === slide.id ? (
                          <div key={slide.id} className="p-4 rounded-xl glass-panel border border-cyber-cyan/35 space-y-4">
                            <div className="text-xs font-bold uppercase text-cyber-cyan tracking-wider">Edit Slide Details</div>
                            <form onSubmit={(e) => handleSlideUpdate(e, slide.id)} className="space-y-3">
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Caption / Heading Text</label>
                                <input
                                  type="text"
                                  value={editSlideForm.caption}
                                  onChange={(e) => setEditSlideForm({ ...editSlideForm, caption: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Display Order</label>
                                <input
                                  type="number"
                                  value={editSlideForm.order}
                                  onChange={(e) => setEditSlideForm({ ...editSlideForm, order: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Slide Image (Upload New)</label>
                                <label className="flex items-center gap-2 px-3 py-2 rounded-lg glass-panel hover:bg-white/5 border border-white/10 cursor-pointer text-xs text-gray-400 hover:text-white transition-all">
                                  <Upload className="w-4 h-4 text-cyber-cyan" />
                                  <span className="truncate">{editSlideForm.file ? editSlideForm.file.name : "Choose new slide image..."}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        setEditSlideForm({ ...editSlideForm, file: e.target.files[0], imageUrl: "" });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-500 text-center">OR</div>
                              <div>
                                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Image URL</label>
                                <input
                                  type="text"
                                  value={editSlideForm.imageUrl}
                                  onChange={(e) => setEditSlideForm({ ...editSlideForm, imageUrl: e.target.value, file: null })}
                                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                />
                              </div>
                              <div className="flex gap-2 justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingSlideId(null)}
                                  className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={slideSubmitting}
                                  className="px-4 py-1.5 rounded-lg bg-cyber-cyan text-white text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                                >
                                  {slideSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <div key={slide.id} className="p-4 rounded-xl glass-panel border border-white/5 space-y-4">
                            <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden group">
                              <img src={slide.imageUrl} alt={slide.caption} className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold uppercase tracking-wider text-cyber-cyan">
                                Order: {slide.order}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-white text-sm truncate">{slide.caption || 'No Caption'}</h4>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingSlideId(slide.id);
                                      setEditSlideForm({
                                        caption: slide.caption || '',
                                        order: slide.order || 0,
                                        imageUrl: slide.imageUrl,
                                        file: null
                                      });
                                    }}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
                                    title="Edit slide details"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlide(slide.id)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    title="Delete slide"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Messages Inbox */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="font-bold text-white text-base">Inquiries Inbox ({messages.length})</h3>

                {messages.length === 0 ? (
                  <div className="p-12 text-center glass-panel rounded-2xl text-gray-500">
                    Your contact inbox is currently empty.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-4 border-b border-white/5">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-white text-base">{msg.name}</h4>
                              {msg.eventDate && (
                                <span className="px-2.5 py-0.5 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-[10px] font-semibold text-cyber-purple flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Event: {msg.eventDate}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 mt-1.5">
                              <a href={`mailto:${msg.email}`} className="hover:text-cyber-cyan transition-colors flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {msg.email}
                              </a>
                              {msg.phone && (
                                <a href={`tel:${msg.phone}`} className="hover:text-cyber-cyan transition-colors flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" />
                                  {msg.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-start">
                            <span className="text-[10px] text-gray-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</span>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[10px] uppercase font-bold text-cyber-cyan tracking-wider mb-2">Message Description</h5>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/2 p-4 rounded-xl border border-white/5">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
