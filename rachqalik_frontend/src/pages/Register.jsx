import { useState } from 'react'
import SignUpForm from '../components/ui/sign-up-form'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', terms: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    if (!form.terms) {
      setError('Please accept the terms to continue.')
      return
    }

    setError('')
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
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

export default Register
