// ============================================================
// CgShared.js — Shared constants, localStorage helpers
// All caregiver sub-pages import from here
// ============================================================

export const API_BASE = import.meta.env.VITE_API_URL ?? "https://smritisetu-backend.onrender.com"

export const LS = {
  PROFILE:        "setu_patient_profile",
  REMINDERS:      "setu_reminders",
  GAMES:          "setu_games",
  MOOD_LOG:       "setu_mood_log",
  COGNITIVE_LOG:  "setu_cognitive_log",
  HEALTH_LOG:     "setu_health_log",
  VITALS_LOG:     "setu_vitals_log",
  CONTACTS:       "setu_emergency_contacts",
  MEMORY_PHOTOS:  "setu_memory_photos",
  PIN:            "setu_pin",
  ACTIVITY_PLAN:  "setu_activity_plan",
  THEME:          "setu_cg_theme",
  LANG:           "setu_cg_lang",
  SAFEZONE:       "setu_safezone",
  HANDOVER_NOTES: "setu_handover_notes",
  FATIGUE_TIMER:  "setu_fatigue_timer",
  AI_ADAPTIVE:    "setu_ai_adaptive",
  PILLBOX_LOG:    "setu_pillbox_log",
  SUNDOWNING_LOG: "setu_sundowning_log",
  CAREGIVERS:     "setu_caregivers_team",
  AUDIT_LOG:      "setu_audit_log",
}

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const REMINDER_DEFAULTS = [
  { id: "med",  icon: "💊", label: "Medicine", labelAs: "ঔষধ",   enabled: true,  time: "08:00", days: [true,true,true,true,true,true,true], voiceB64: null },
  { id: "food", icon: "🍽️", label: "Food",     labelAs: "খাদ্য", enabled: true,  time: "10:00", days: [true,true,true,true,true,true,true], voiceB64: null },
  { id: "doc",  icon: "🩺", label: "Doctor",   labelAs: "ডাক্তৰ",enabled: false, time: "12:00", days: [false,false,false,false,false,false,false], voiceB64: null },
  { id: "walk", icon: "🚶", label: "Walk",     labelAs: "হাঁটিব", enabled: true,  time: "17:00", days: [true,true,true,true,true,true,false], voiceB64: null },
]

export const ALL_GAMES = [
  { id: "game1",  labelEn: "Which festival?",     labelAs: "কি উৎসৱ?",          enabled: true,  difficulty: "easy"   },
  { id: "game2",  labelEn: "What were they?",     labelAs: "কি কি আছিল?",       enabled: true,  difficulty: "easy"   },
  { id: "game3",  labelEn: "Where did it go?",    labelAs: "ক'ত গ'ল?",           enabled: true,  difficulty: "medium" },
  { id: "game4",  labelEn: "Look at this",        labelAs: "এইটো চাওঁ",          enabled: true,  difficulty: "easy"   },
  { id: "game5",  labelEn: "Which is different?", labelAs: "ভিন্ন কোন?",         enabled: true,  difficulty: "medium" },
  { id: "game6",  labelEn: "Take along / Match",  labelAs: "লগা লৈ যাও",         enabled: false, difficulty: "medium" },
  { id: "game7",  labelEn: "What's needed here?", labelAs: "বসাৰত কি লাগে?",     enabled: false, difficulty: "hard"   },
  { id: "game8",  labelEn: "Match them",          labelAs: "মিলাই দিয়া",         enabled: true,  difficulty: "easy"   },
  { id: "game9",  labelEn: "How many are left?",  labelAs: "বাকি ক'তটা?",        enabled: true,  difficulty: "medium" },
  { id: "game10", labelEn: "What should be done?",labelAs: "কি কৰিব?",           enabled: false, difficulty: "hard"   },
  { id: "game11", labelEn: "Describe Your Day",   labelAs: "বিশেষ খেলা",         enabled: true,  difficulty: "easy"   },
]

export const PROFILE_DEFAULT = {
  name: "Meena Sharma",
  age: "72",
  gender: "Female",
  stage: "early",
  blood_group: "B+",
  allergies: "Penicillin, Dust",
  diagnosis_date: "2024-03-15",
  doctor_name: "Dr. Bhupen Hazarika (Neurologist)",
  doctor_phone: "+91 94350 99887",
  health_id: "ABHA-AS-2026-8891",
  photo_b64: null,
}

export const CAREGIVERS_DEFAULT = [
  {
    id: "cg_1",
    name: "Vatsal Goyal",
    role: "Son (Primary Caregiver)",
    category: "family",
    phone: "+91 98765 43210",
    email: "vatsal@smritisetu.org",
    accessLevel: "Superuser (Full Control)",
    active: true,
    addedDate: "2026-09-01",
    avatar: "👨"
  },
  {
    id: "cg_2",
    name: "Ananya Baruah",
    role: "ASHA Community Health Worker",
    category: "asha",
    phone: "+91 98123 45678",
    email: "ananya.asha@assamhealth.gov.in",
    healthCenter: "Guwahati Urban Health Post #4",
    accessLevel: "Vitals & Cognitive Monitoring",
    active: true,
    addedDate: "2026-09-05",
    avatar: "👩‍⚕️"
  },
  {
    id: "cg_3",
    name: "Pranjal Das",
    role: "Home Care Attendant / Nurse",
    category: "nurse",
    phone: "+91 94350 11223",
    email: "pranjal.nurse@careplus.in",
    shift: "Day Shift (08:00 AM – 04:00 PM)",
    accessLevel: "Pillbox & Routine Tracking",
    active: true,
    addedDate: "2026-09-12",
    avatar: "👨‍⚕️"
  }
]

export const AUDIT_LOG_DEFAULT = [
  { id: "aud_1", actor: "Vatsal Goyal (Son)", action: "Morning Aspirin 75mg marked as Taken in Pillbox", time: "Today, 08:15 AM", type: "meds", badge: "Pillbox" },
  { id: "aud_2", actor: "Ananya Baruah (ASHA Worker)", action: "Completed MMSE Screening (Score: 24/30)", time: "Today, 11:30 AM", type: "clinical", badge: "MMSE" },
  { id: "aud_3", actor: "System AI Engine", action: "Evening Sundowning Agitation Advisory flagged for 05:30 PM", time: "Today, 02:00 PM", type: "ai", badge: "AI Advisory" },
  { id: "aud_4", actor: "Pranjal Das (Nurse)", action: "Day Shift Handover Notes logged & approved", time: "Yesterday, 04:00 PM", type: "handover", badge: "Handover" },
  { id: "aud_5", actor: "Vatsal Goyal (Son)", action: "Caregiver PIN & Emergency SOS Directory verified", time: "21 Sept, 09:30 PM", type: "security", badge: "Security" },
]

export const CONTACTS_DEFAULT = [
  { id: "c1", name: "Dr. Bhupen Hazarika (Neurology)", phone: "+91 94350 99887", type: "doctor" },
  { id: "c2", name: "Vatsal Goyal (Son)", phone: "+91 98765 43210", type: "family" },
  { id: "c3", name: "Ananya Baruah (ASHA Worker)", phone: "+91 98123 45678", type: "asha" },
  { id: "c4", name: "Emergency Ambulance", phone: "108", type: "emergency" },
]

// ── helpers ────────────────────────────────────────────────
export function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

/** YYYY-MM-DD of today */
export function today() {
  return new Date().toISOString().slice(0, 10)
}

/** Last N days as YYYY-MM-DD strings */
export function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}

/** Short day label from YYYY-MM-DD */
export function shortDay(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "short" })
}
