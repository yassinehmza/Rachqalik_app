import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SignInForm from '../components/ui/sign-in-form'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      login({ email: form.email })
      navigate('/dashboard')
    }, 600)
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-black px-4 py-10 flex items-center justify-center">
      <SignInForm
        form={form}
        setForm={setForm}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </main>
  )
}
