import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SignUpForm from '../components/ui/sign-up-form'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', terms: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()

    if (!form.terms) {
      setError('Please accept the terms to continue.')
      return
    }
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setError('')
    setLoading(true)
    setTimeout(() => {
      login({ email: form.email })
      navigate('/dashboard')
    }, 700)
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-black px-4 py-10 flex items-center justify-center">
      <SignUpForm
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </main>
  )
}
