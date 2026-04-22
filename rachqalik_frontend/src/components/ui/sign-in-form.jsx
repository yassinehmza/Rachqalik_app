import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { EyeOff, Lock, Mail } from 'lucide-react'

const defaultForm = { email: '', password: '' }

export default function SignInForm({
  form = defaultForm,
  setForm = () => {},
  onSubmit = (e) => e.preventDefault(),
  loading = false,
  error = '',
}) {
  return (
    <Card className="w-full max-w-[640px] rounded-[28px] border border-white/20 bg-[#050505] text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
      <CardContent className="p-7 sm:p-10 md:p-12">
        <form onSubmit={onSubmit} className="flex flex-col gap-5 sm:gap-6">
          <div className="text-center space-y-4 pt-2">
            <h1 className="text-[clamp(2.2rem,3.6vw,3rem)] leading-tight font-extrabold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white/90">
              Sign in and continue where you left off.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-[18px] font-semibold text-white">
              Email Address
            </Label>
            <div className="flex h-12 items-center rounded-2xl border border-white/15 bg-[#0c0c0c] px-4 shadow-[0_1px_2px_rgba(0,0,0,0.15)] focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition">
              <Mail className="h-5 w-5 shrink-0 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 text-[15px] text-white placeholder:text-zinc-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-[18px] font-semibold text-white">
              Password
            </Label>
            <div className="flex h-12 items-center rounded-2xl border border-white/15 bg-[#0c0c0c] px-4 shadow-[0_1px_2px_rgba(0,0,0,0.15)] focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition">
              <Lock className="h-5 w-5 shrink-0 text-zinc-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 text-[15px] text-white placeholder:text-zinc-500"
                required
              />
              <EyeOff className="h-5 w-5 shrink-0 text-zinc-500" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black" />
              <Label htmlFor="remember" className="text-sm font-medium text-zinc-300">
                Remember me
              </Label>
            </div>

            <button type="button" className="text-sm font-medium text-white hover:underline">
              Forgot password?
            </button>
          </div>

          {error ? <p className="text-sm font-medium text-red-400">{error}</p> : null}

          <Button
            type="submit"
            className="h-14 rounded-2xl bg-white text-base font-semibold text-black shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:bg-zinc-200"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-white hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
