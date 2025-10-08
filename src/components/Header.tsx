'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe, Phone, Mail, User, LogOut, Heart, GitCompare } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'
import AuthModal from './AuthModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user, isLoggedIn, logout } = useUser()

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.properties'), href: '/properties' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.contact'), href: '/contact' },
    { name: 'Admin', href: '/admin' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Rentora</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{t('contact.phone')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{t('contact.email')}</span>
              </div>
            </div>
            
            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link href="/favorites" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Heart className="w-4 h-4" />
                      <span>Favorites ({user?.favoriteProperties.length || 0})</span>
                    </Link>
                    <Link href="/comparison" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <GitCompare className="w-4 h-4" />
                      <span>Compare ({user?.comparisonList.length || 0})</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-primary"
              >
                Sign In
              </button>
            )}
            
            <button className="btn-secondary">
              {t('get.consultation')}
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-sm rounded ${
                  language === 'en' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ja')}
                className={`px-2 py-1 text-sm rounded ${
                  language === 'ja' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                日本語
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4" />
                      <span>{t('contact.phone')}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Mail className="w-4 h-4" />
                      <span>{t('contact.email')}</span>
                    </div>
                    <button className="btn-primary w-full">
                      {t('get.consultation')}
                    </button>
                    <div className="flex items-center space-x-2 mt-4">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-1 text-sm rounded ${
                          language === 'en' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setLanguage('ja')}
                        className={`px-2 py-1 text-sm rounded ${
                          language === 'ja' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'
                        }`}
                      >
                        日本語
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  )
}