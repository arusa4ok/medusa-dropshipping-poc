'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-luxury-border/30' 
        : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        {/* Top bar with luxury info */}
        <div className="hidden lg:flex items-center justify-between py-2 text-xs text-luxury-gray border-b border-luxury-border/20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Premium Support
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Shopping
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Best Price Guarantee
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/account" className="hover:text-primary transition-colors">My Account</Link>
            <Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
            <Link href="/help" className="hover:text-primary transition-colors">Help</Link>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex h-20 items-center justify-between">
          {/* Logo with luxury styling */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-luxury group-hover:shadow-premium transition-all duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-luxury-dark group-hover:text-primary transition-colors duration-300">
                Secrets Shop
              </span>
              <div className="text-xs text-luxury-gray tracking-widest uppercase">Premium Collection</div>
            </div>
          </Link>

          {/* Desktop Navigation with luxury styling */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link href="/products" className="flex items-center gap-2 text-sm font-luxury font-medium text-luxury-dark hover:text-primary transition-all duration-300 py-2">
                Products
                <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {/* Dropdown menu would go here */}
            </div>
            
            <Link href="/categories" className="text-sm font-luxury font-medium text-luxury-dark hover:text-primary transition-all duration-300 py-2 relative group">
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/new-arrivals" className="text-sm font-luxury font-medium text-luxury-dark hover:text-primary transition-all duration-300 py-2 relative group">
              New Arrivals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/brands" className="text-sm font-luxury font-medium text-luxury-dark hover:text-primary transition-all duration-300 py-2 relative group">
              Brands
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/sale" className="text-sm font-luxury font-medium text-accent-error hover:text-primary transition-all duration-300 py-2 relative group">
              Sale
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right side actions with luxury styling */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Link href="/search" className="p-2 rounded-lg hover:bg-luxury-background transition-all duration-300 group">
              <svg className="h-5 w-5 text-luxury-gray group-hover:text-primary transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </Link>

            {/* Account */}
            <Link href="/account" className="p-2 rounded-lg hover:bg-luxury-background transition-all duration-300 group">
              <svg className="h-5 w-5 text-luxury-gray group-hover:text-primary transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 rounded-lg hover:bg-luxury-background transition-all duration-300 group relative">
              <svg className="h-5 w-5 text-luxury-gray group-hover:text-primary transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">3</span>
            </Link>

            {/* Cart with luxury styling */}
            <Link href="/cart" className="relative group">
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold shadow-luxury hover:shadow-premium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Cart (0)</span>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent-gold text-luxury-dark text-xs font-bold rounded-full flex items-center justify-center shadow-luxury">0</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-luxury-background transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6 text-luxury-dark" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation with luxury styling */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-luxury-border/20 animate-fade-in-down">
            <nav className="space-y-4">
              <Link href="/products" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                Products
              </Link>
              <Link href="/categories" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                Categories
              </Link>
              <Link href="/new-arrivals" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                New Arrivals
              </Link>
              <Link href="/brands" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                Brands
              </Link>
              <Link href="/sale" className="block py-3 text-lg font-luxury font-medium text-accent-error hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                Sale
              </Link>
              <Link href="/account" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                My Account
              </Link>
              <Link href="/wishlist" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300 border-b border-luxury-border/10">
                Wishlist
              </Link>
              <Link href="/help" className="block py-3 text-lg font-luxury font-medium text-luxury-dark hover:text-primary transition-colors duration-300">
                Help & Support
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
