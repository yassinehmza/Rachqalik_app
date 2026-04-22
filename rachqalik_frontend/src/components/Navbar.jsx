import { AnimatedNavFramer } from './ui/navigation-menu'

function Navbar() {
  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Rachqalik', href: '/#features' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Connexion', href: '/login' },
  ]

  return (
    <AnimatedNavFramer
      navItems={navItems}
      ctaLabel="Inscription"
      ctaHref="/register"
      logoLabel="Rachqalik"
    />
  )
}

export default Navbar
