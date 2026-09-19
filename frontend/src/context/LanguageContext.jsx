/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const LANG_STORAGE_KEY = 'smritisetu_lang'

export const translations = {
  as: {
    langBtn: 'EN',
    langToggleAria: 'Switch to English',
    
    // RoleSelect
    rolePrompt: 'আপুনি কোন হিচাপে ব্যৱহাৰ কৰিব?',
    rolePatient: 'পেচেণ্ট (Patient)',
    roleCaregiver: 'কেয়াৰগিভাৰ (Caregiver)',
    rolePatientAria: 'পেচেণ্ট হিচাপে প্ৰৱেশ কৰক',
    roleCaregiverAria: 'কেয়াৰগিভাৰ হিচাপে প্ৰৱেশ কৰক',

    // PatientHome
    patientBackAria: 'ভূমিকা বাছনিলৈ উভতি যাওক',
    patientGrandmaAlt: 'স্বাগতম জনোৱা আইতা',
    patientReminders: 'মনত পেলোৱা (Reminders)',
    patientGames: 'মোৰ খেলা (Games)',

    // ReminderPage
    remTitle: 'মোৰ মনত পেলোৱা',
    remBackAria: 'ঘৰলৈ উভতি যাওক',
    remMedicine: 'ঔষধ',
    remFood: 'খাদ্য',
    remDoctor: 'ডাক্তৰ',
    remWalk: 'হাঁটিব',
    remCancel: 'বাতিল',
    remSave: 'ৰাখক',
    remTimeSet: 'সময় সলনি কৰক',

    // GamesPage
    gamesTitle: 'মোৰ খেলা',
    gamesDialogue: 'মনে ৰাখোঁ, আনন্দৰে খেলোঁ!',
    gamesBackAria: 'ঘৰলৈ উভতি যাওক',
    gamesLoading: 'খেলা লোড হৈ আছে…',
    gamesExit: '← খেল বন্ধ কৰি উভতি যাওক',
    gamesTapToPlay: 'খেলিবলৈ টিপক',
    gamesListenName: 'নাম শুনক',

    // CaregiverHome
    cgTitle: 'SmritiSetu — স্মৃতিসেতু',
    cgSubtitle: 'কেয়াৰগিভাৰ ডেচবৰ্ড (Caregiver Dashboard)',
    cgGamesTitle: 'খেলা বাছনি (Game Selection)',
    cgGamesDesc: 'ৰোগীয়ে দেখা খেলসমূহ বাছনি কৰক',
    cgRemTitle: 'মনত পেলোৱা সময় (Reminder Times)',
    cgRemDesc: 'ঔষধ, খাদ্য, ডাক্তৰ আৰু খোজ কঢ়াৰ দৈনিক সময় নিৰ্ধাৰণ কৰক',
    cgSwitchRole: '← ভূমিকা সলনি কৰক (Switch Role)',
    cgSaveGames: 'খেলা বাছনি সাঁচি ৰাখক (Save)',
    cgSaveReminders: 'সময় সাঁচি ৰাখক (Save Times)',
    cgSelectedOf: 'নিৰ্বাচিত',
    cgMinRequired: '— নিম্নতম ৩ টা খেল বাছি লওক',
    cgMaxReached: '— সৰ্বাধিক সীমা পাইছে',
    cgBack: '← উভতি যাওক (Back)',
    cgSaving: 'সাঁচি থকা হৈছে…',
    cgSavedOk: 'সফলভাৱে সংৰক্ষণ কৰা হ’ল।',
    cgSaveFailed: 'সংৰক্ষণ বিফল হ’ল: ',
    cgDailyTimePrompt: 'প্ৰতিটো মনত পেলোৱাৰ বাবে দৈনিক সময় নিৰ্ধাৰণ কৰক।'
  },
  en: {
    langBtn: 'অ',
    langToggleAria: 'Switch to Assamese (অসমীয়া)',
    
    // RoleSelect
    rolePrompt: 'Which role will you continue as?',
    rolePatient: 'Patient (ৰোগী)',
    roleCaregiver: 'Caregiver (কেয়াৰগিভাৰ)',
    rolePatientAria: 'Continue as Patient',
    roleCaregiverAria: 'Continue as Caregiver',

    // PatientHome
    patientBackAria: 'Back to role selection',
    patientGrandmaAlt: 'Welcoming Grandma',
    patientReminders: 'Reminders (মনত পেলোৱা)',
    patientGames: 'My Games (মোৰ খেলা)',

    // ReminderPage
    remTitle: 'My Daily Reminders',
    remBackAria: 'Back to home',
    remMedicine: 'Medicine',
    remFood: 'Food',
    remDoctor: 'Doctor',
    remWalk: 'Walk',
    remCancel: 'Cancel',
    remSave: 'Save',
    remTimeSet: 'Set Reminder Time',

    // GamesPage
    gamesTitle: 'My Games',
    gamesDialogue: 'Remember with joy, play with happiness!',
    gamesBackAria: 'Back to home',
    gamesLoading: 'Loading games…',
    gamesExit: '← Exit Game and Return',
    gamesTapToPlay: 'Tap to play',
    gamesListenName: 'Listen to title',

    // CaregiverHome
    cgTitle: 'SmritiSetu',
    cgSubtitle: 'Caregiver Dashboard',
    cgGamesTitle: 'Game Selection',
    cgGamesDesc: 'Choose which games the patient sees',
    cgRemTitle: 'Reminder Times',
    cgRemDesc: 'Set daily times for medicine, food, doctor & walk',
    cgSwitchRole: '← Switch Role',
    cgSaveGames: 'Save Game Selection',
    cgSaveReminders: 'Save Reminder Times',
    cgSelectedOf: 'selected of',
    cgMinRequired: '— minimum 3 required',
    cgMaxReached: '— maximum reached',
    cgBack: '← Back',
    cgSaving: 'Saving…',
    cgSavedOk: 'Saved successfully.',
    cgSaveFailed: 'Save failed: ',
    cgDailyTimePrompt: 'Set the daily time for each reminder type.'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY)
      return saved === 'en' || saved === 'as' ? saved : 'as'
    } catch {
      return 'as'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch (e) {
      console.warn('Could not save language to localStorage:', e)
    }
    document.documentElement.lang = lang === 'as' ? 'as' : 'en'
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
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
