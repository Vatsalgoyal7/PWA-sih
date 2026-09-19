import { useState } from 'react'
import RoleSelect from './components/RoleSelect'
import PatientHome from './pages/PatientHome'
import CaregiverHome from './pages/CaregiverHome'
import './App.css'

const ROLE_KEY = 'smritisetu_device_role'

function App() {
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem(ROLE_KEY)
    return savedRole === 'patient' || savedRole === 'caregiver' ? savedRole : null
  })

  const handleSelectRole = (selectedRole) => {
    localStorage.setItem(ROLE_KEY, selectedRole)
    setRole(selectedRole)
  }

  const handleChangeRole = () => {
    localStorage.removeItem(ROLE_KEY)
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