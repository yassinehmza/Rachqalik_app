import { useState } from 'react'
import SignInForm from '../components/ui/sign-in-form'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
    }, 700)
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

export default Login
