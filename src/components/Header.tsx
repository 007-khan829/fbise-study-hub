'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Shield,
  ChevronDown,
  Search,
  Flame,
  FileText,
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // Check initial dark mode from document or localStorage
    const savedTheme = localStorage.getItem('fbise_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fbise_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fbise_theme', 'dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { label: 'Past Papers', href: '/past-papers', icon: BookOpen },
    { label: 'Model Papers', href: '/model-papers', icon: FileText },
    { label: 'Daily Quizzes', href: '/quizzes', icon: Sparkles },
    { label: 'AI Paper Checker', href: '/ai-paper-check', icon: Sparkles, highlight: true },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Announcements', href: '/announcements', icon: Bell },
  ];

  const classSections = [
    { label: 'Class 9 (SSC Part 1)', href: '/classes/class-9', grade: '9' },
    { label: 'Class 10 (SSC Part 2)', href: '/classes/class-10', grade: '10' },
    { label: '1st Year — Class 11 (HSSC 1)', href: '/classes/class-11', grade: '11' },
    { label: '2nd Year — Class 12 (HSSC 2)', href: '/classes/class-12', grade: '12' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/10 dark:border-emerald-500/20 shadow-sm transition-colors">
      {/* Top FBISE Notice Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide">
            OFFICIAL FBISE CURRICULUM
          </span>
          <span className="text-emerald-100 font-medium">
            Federal Board SSC & HSSC Student Learning Outcomes (SLO) Portal
          </span>
        </div>
        <div className="flex items-center space-x-4 text-emerald-200 text-[11px]">
          <span>Islamabad, Pakistan</span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">Prepare Smart. Practice Better. Achieve More.</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform border border-amber-400/40">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-emerald-900 dark:text-emerald-400">
                  FBISE
                </span>
                <span className="font-extrabold text-xl tracking-tight text-amber-600 dark:text-amber-400">
                  Study Hub
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                Federal Board Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Classes Dropdown */}
            <div className="relative">
              <button
                onClick={() => setClassesDropdownOpen(!classesDropdownOpen)}
                onBlur={() => setTimeout(() => setClassesDropdownOpen(false), 200)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname.startsWith('/classes')
                    ? 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Classes</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${classesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {classesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Select Your Class
                  </div>
                  {classSections.map((cls) => (
                    <Link
                      key={cls.href}
                      href={cls.href}
                      className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => setClassesDropdownOpen(false)}
                    >
                      <span className="font-medium">{cls.label}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-600 dark:text-slate-300">
                        Part {cls.grade === '9' || cls.grade === '11' ? '1' : '2'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Nav Items */}
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    item.highlight
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200/50 dark:border-amber-500/20'
                      : isActive
                      ? 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Theme Toggle, User Profile or Sign In */}
          <div className="flex items-center space-x-3">
            {/* Global Search Button */}
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons or User Avatar */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 bg-slate-50 dark:bg-slate-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left text-xs pr-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {user.role === 'ADMIN' ? 'Admin' : `Class ${user.className}`}
                      </span>
                      {user.streak > 0 && (
                        <span className="flex items-center text-[10px] text-amber-600 font-bold">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {user.streak}d
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                          {user.role === 'ADMIN' ? 'Administrator' : `Class ${user.className} Student`}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Student Dashboard</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors font-medium"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
            Class Sections
          </div>
          <div className="grid grid-cols-2 gap-2">
            {classSections.map((cls) => (
              <Link
                key={cls.href}
                href={cls.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900"
              >
                {cls.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
            Quick Navigation
          </div>
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    item.highlight
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
              >
                <UserIcon className="w-4 h-4" />
                <span>My Dashboard</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 mt-1 rounded-lg text-sm font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
