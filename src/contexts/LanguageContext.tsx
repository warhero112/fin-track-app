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
    'language.english': 'English',
    'language.japanese': '日本語',
    'property.price': 'Price',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.area': 'Area',
    'property.location': 'Location',
    'property.features': 'Features',
    'property.description': 'Description',
    'property.contact': 'Contact Agent',
    'property.save': 'Save',
    'property.share': 'Share',
    'property.compare': 'Compare',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'search.placeholder': 'Search by location, property type, or keywords...',
    'search.filters': 'Filters',
    'search.sortBy': 'Sort By',
    'search.newest': 'Newest',
    'search.oldest': 'Oldest',
    'search.priceAsc': 'Price: Low to High',
    'search.priceDesc': 'Price: High to Low',
    'search.areaAsc': 'Area: Small to Large',
    'search.areaDesc': 'Area: Large to Small',
    'search.noResults': 'No properties found',
    'search.clearFilters': 'Clear All Filters',
    'property.rent': 'Rent',
    'property.buy': 'Buy',
    'property.perMonth': '/month',
    'property.total': 'total',
    'property.station': 'Station',
    'property.walkTime': 'min walk',
    'property.available': 'Available',
    'property.pending': 'Pending',
    'property.sold': 'Sold',
    'property.furnished': 'Furnished',
    'property.petsAllowed': 'Pets Allowed',
    'property.balcony': 'Balcony',
    'property.tatami': 'Tatami',
    'property.scheduleViewing': 'Schedule Viewing',
    'property.viewDetails': 'View Details',
    'contact.title': 'Contact Us',
    'contact.description': 'Get in touch with our team for any questions or assistance',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.phone': 'Phone Number',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.sendMessage': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message Sent Successfully!',
    'contact.error': 'Error Sending Message',
    'contact.inquiryType': 'Inquiry Type',
    'contact.general': 'General Inquiry',
    'contact.property': 'Property Inquiry',
    'contact.viewing': 'Schedule Viewing',
    'contact.support': 'Technical Support'
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
    'language.english': 'English',
    'language.japanese': '日本語',
    'property.price': '価格',
    'property.bedrooms': '寝室',
    'property.bathrooms': '浴室',
    'property.area': '面積',
    'property.location': '場所',
    'property.features': '設備',
    'property.description': '説明',
    'property.contact': 'エージェントに連絡',
    'property.save': '保存',
    'property.share': '共有',
    'property.compare': '比較',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.close': '閉じる',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.previous': '前へ',
    'common.submit': '送信',
    'common.reset': 'リセット',
    'common.confirm': '確認',
    'common.yes': 'はい',
    'common.no': 'いいえ',
    'common.ok': 'OK',
    'search.placeholder': '場所、物件タイプ、キーワードで検索...',
    'search.filters': 'フィルター',
    'search.sortBy': '並び順',
    'search.newest': '新着順',
    'search.oldest': '古い順',
    'search.priceAsc': '価格：安い順',
    'search.priceDesc': '価格：高い順',
    'search.areaAsc': '面積：小さい順',
    'search.areaDesc': '面積：大きい順',
    'search.noResults': '物件が見つかりません',
    'search.clearFilters': 'フィルターをクリア',
    'property.rent': '賃貸',
    'property.buy': '売買',
    'property.perMonth': '/月',
    'property.total': '総額',
    'property.station': '駅',
    'property.walkTime': '分歩き',
    'property.available': '利用可能',
    'property.pending': '保留中',
    'property.sold': '売却済み',
    'property.furnished': '家具付き',
    'property.petsAllowed': 'ペット可',
    'property.balcony': 'バルコニー',
    'property.tatami': '畳',
    'property.scheduleViewing': '内見予約',
    'property.viewDetails': '詳細を見る',
    'contact.title': 'お問い合わせ',
    'contact.description': 'ご質問やサポートが必要な場合は、お気軽にお問い合わせください',
    'contact.name': 'お名前',
    'contact.email': 'メールアドレス',
    'contact.phone': '電話番号',
    'contact.subject': '件名',
    'contact.message': 'メッセージ',
    'contact.sendMessage': 'メッセージを送信',
    'contact.sending': '送信中...',
    'contact.success': 'メッセージが正常に送信されました！',
    'contact.error': 'メッセージの送信に失敗しました',
    'contact.inquiryType': 'お問い合わせ種別',
    'contact.general': '一般的なお問い合わせ',
    'contact.property': '物件に関するお問い合わせ',
    'contact.viewing': '内見予約',
    'contact.support': '技術サポート'
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