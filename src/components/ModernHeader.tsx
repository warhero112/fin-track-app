'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Heart, User, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { user, isLoggedIn } = useUser()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en')
  }

  const navItems = [
    { href: '/', label: 'Home', key: 'nav.home' },
    { href: '/properties', label: 'Properties', key: 'nav.properties' },
    { href: '/about', label: 'About', key: 'nav.about' },
    { href: '/services', label: 'Services', key: 'nav.services' },
    { href: '/contact', label: 'Contact', key: 'nav.contact' }
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-soft' 
        : 'bg-transparent'
    }`}>
      <div className="container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Rentora</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-gray-600" />
            </button>

            {/* Search */}
            <Link
              href="/properties"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Search properties"
            >
              <Search className="w-4 h-4 text-gray-600" />
            </Link>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Favorites"
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Profile"
              >
                <User className="w-4 h-4 text-gray-600" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm px-4 py-2"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {!isLoggedIn && (
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full btn-primary text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}