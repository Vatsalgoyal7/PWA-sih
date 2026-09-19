import { useState } from 'react'
import RoleSelect from './components/RoleSelect'
import PatientHome from './pages/PatientHome'
import CaregiverHome from './pages/CaregiverHome'
import { LanguageProvider } from './context/LanguageContext'
import LanguageToggle from './components/LanguageToggle'
import './App.css'

const ROLE_KEY = 'smritisetu_device_role'

function MainContent() {
  const [role, setRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_KEY)
      return savedRole === 'patient' || savedRole === 'caregiver' ? savedRole : null
    } catch {
      return null
    }
  })

  const handleSelectRole = (selectedRole) => {
    try {
      localStorage.setItem(ROLE_KEY, selectedRole)
    } catch (e) {
      console.warn('LocalStorage error:', e)
    }
    setRole(selectedRole)
  }

  const handleChangeRole = () => {
    try {
      localStorage.removeItem(ROLE_KEY)
    } catch (e) {
      console.warn('LocalStorage error:', e)
    }
    setRole(null)
  }

  return (
    <>
      {!role && <RoleSelect onSelect={handleSelectRole} />}
      {role === 'patient' && <PatientHome onChangeRole={handleChangeRole} />}
      {role === 'caregiver' && <CaregiverHome onChangeRole={handleChangeRole} />}
      <LanguageToggle />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  )
}

export default App