import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  as: {
    roleSelectTitle: 'আপুনি কোন হিচাপে ব্যৱহাৰ কৰিব?',
    patient: 'পেচেণ্ট',
    caregiver: 'কেয়াৰগিভাৰ',
    patientDesc: 'মই নিজৰ যত্ন ল’ম',
    caregiverDesc: 'মই আনৰ সহায় কৰিম',
    welcome: 'নমস্কাৰ!',
    welcomeDesc: 'মনে ৰাখোঁ, আনন্দৰে খেলোঁ!',
    reminders: 'সোঁৱৰণী',
    games: 'মোৰ খেলা',
    back: 'ঘূৰি যাওক',
    home: 'মুখ্য পৃষ্ঠা',
    loading: 'লোড হৈ আছে...',
    save: 'সংৰক্ষণ কৰক',
    cancel: 'বাতিল কৰক',
    speak: 'শুনি লওক',
    // Reminders
    medicine: 'ঔষধ',
    food: 'খাদ্য',
    doctor: 'ডাক্তৰ',
    walk: 'হাঁটিব',
    reminderTitle: 'দৈনিক সোঁৱৰণী',
    setTime: 'সময় নিৰ্ধাৰণ কৰক',
    // Games
    gameTitle: 'মোৰ খেলা',
    gameDialogue: 'মনে ৰাখোঁ, আনন্দৰে খেলোঁ!',
    tapToPlay: 'খেলিবলৈ টিপক',
    speechLang: 'as-IN'
  },
  en: {
    roleSelectTitle: 'Which role will you use as?',
    patient: 'Patient',
    caregiver: 'Caregiver',
    patientDesc: 'I am taking care of myself',
    caregiverDesc: 'I am assisting someone',
    welcome: 'Welcome!',
    welcomeDesc: 'Remember with joy, play with care!',
    reminders: 'Reminders',
    games: 'My Games',
    back: 'Back',
    home: 'Home',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    speak: 'Listen',
    // Reminders
    medicine: 'Medicine',
    food: 'Food',
    doctor: 'Doctor',
    walk: 'Walk',
    reminderTitle: 'Daily Reminders',
    setTime: 'Set Time',
    // Games
    gameTitle: 'My Games',
    gameDialogue: 'Remember with joy, play with care!',
    tapToPlay: 'Tap to play',
    speechLang: 'en-IN'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('smritisetu_lang') || 'as'
    } catch {
      return 'as'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('smritisetu_lang', lang)
    } catch (e) {
      console.warn('Could not save language to storage', e)
    }
  }, [lang])

  const toggleLang = () => {
    setLang(prev => (prev === 'as' ? 'en' : 'as'))
  }

  const t = (key) => {
    return translations[lang]?.[key] || translations['as']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
