import { useState } from 'react'
import RoleSelect from './components/RoleSelect'
import PatientHome from './pages/PatientHome'
import CaregiverHome from './pages/CaregiverHome'
import './App.css'

const ROLE_KEY = 'smritisetu_device_role'

function App() {
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

  if (!role) {
    return <RoleSelect onSelect={handleSelectRole} />
  }

  return role === 'patient' ? (
    <PatientHome onChangeRole={handleChangeRole} />
  ) : (
    <CaregiverHome onChangeRole={handleChangeRole} />
  )
}

export default App