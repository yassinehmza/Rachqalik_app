import { useNavigate } from 'react-router-dom'
import { AnimatedNavFramer } from './ui/navigation-menu'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const publicNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/#insights' },
  ]

  const authNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AnimatedNavFramer
      navItems={isAuthenticated ? authNavItems : publicNavItems}
      ctaLabel={isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Sign In'}
      ctaHref={isAuthenticated ? '/dashboard' : '/login'}
      logoLabel="Rachqalik"
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    />
  )
}
