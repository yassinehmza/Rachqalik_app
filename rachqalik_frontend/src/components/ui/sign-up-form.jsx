import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { EyeOff, Lock, Mail, User } from 'lucide-react'

const defaultForm = { name: '', email: '', password: '', terms: false }

export default function SignUpForm({
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
              Create Your Account
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white/90">
              Sign up and start exploring features tailored just for you.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-[18px] font-semibold text-white">
              Full Name
            </Label>
            <div className="flex h-12 items-center rounded-2xl border border-white/15 bg-[#0c0c0c] px-4 shadow-[0_1px_2px_rgba(0,0,0,0.15)] focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition">
              <User className="h-5 w-5 shrink-0 text-zinc-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 text-[15px] text-white placeholder:text-zinc-500"
                required
              />
            </div>
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

          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Checkbox
              id="terms"
              checked={form.terms}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  terms: Boolean(checked),
                }))
              }
              className="mt-0.5 border-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
            />
            <Label htmlFor="terms" className="text-sm leading-6 font-normal text-zinc-400">
              By continuing, you agree to our{' '}
              <a href="#" className="font-semibold text-white hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-white hover:underline">
                Privacy Policy
              </a>.
            </Label>
          </div>

          {error ? <p className="text-sm font-medium text-red-400">{error}</p> : null}

          <Button
            type="submit"
            className="h-14 rounded-2xl bg-white text-base font-semibold text-black shadow-[0_10px_24px_rgba(0,0,0,0.35)] hover:bg-zinc-200"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
