'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'ja'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'hero.title': 'Find Your Perfect Home in Japan',
    'hero.subtitle': 'Expert real estate services for foreigners. We speak your language and understand your needs.',
    'search.properties': 'Search Properties',
    'get.consultation': 'Get Free Consultation',
    'contact.phone': '+81-3-1234-5678',
    'contact.email': 'info@rentora.jp',
    'language.english': 'English',
    'language.japanese': '日本語'
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.properties': '物件一覧',
    'nav.about': '会社概要',
    'nav.services': 'サービス',
    'nav.contact': 'お問い合わせ',
    'hero.title': '日本で理想の住まいを見つけよう',
    'hero.subtitle': '外国人向けの不動産サービス。あなたの言語でサポートし、ニーズを理解します。',
    'search.properties': '物件を検索',
    'get.consultation': '無料相談を受ける',
    'contact.phone': '+81-3-1234-5678',
    'contact.email': 'info@rentora.jp',
    'language.english': 'English',
    'language.japanese': '日本語'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}