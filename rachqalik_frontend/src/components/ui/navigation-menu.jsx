import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { LogOut, Menu, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'
import './navigation-menu.css'

const EXPAND_SCROLL_THRESHOLD = 80

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: 'auto',
    transition: {
      y: { type: 'spring', damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: 'spring',
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: '3rem',
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: 'spring', damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
}

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
}

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
}

export function AnimatedNavFramer({
  navItems = [],
  ctaLabel = 'Essai gratuit',
  ctaHref = '/register',
  logoLabel = 'Rachqalik',
  isAuthenticated = false,
  onLogout,
}) {
  const [isExpanded, setExpanded] = React.useState(true)

  const { scrollY } = useScroll()
  const lastScrollY = React.useRef(0)
  const scrollPositionOnCollapse = React.useRef(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false)
      scrollPositionOnCollapse.current = latest
    } else if (!isExpanded && latest < previous && scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD) {
      setExpanded(true)
    }

    lastScrollY.current = latest
  })

  const handleNavClick = (e) => {
    if (!isExpanded) {
      e.preventDefault()
      setExpanded(true)
    }
  }

  return (
    <div className="anf-wrap">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          'anf-nav',
          !isExpanded && 'anf-nav--collapsed',
        )}
      >
        <motion.div variants={logoVariants} className="anf-logo">
          <Navigation className="anf-logo-icon" />
          <span className="anf-logo-text">{logoLabel}</span>
        </motion.div>

        <motion.div className={cn('anf-links', !isExpanded && 'anf-links--disabled')}>
          {navItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Link
                to={item.href}
                onClick={(e) => e.stopPropagation()}
                className="anf-link"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link
            to={ctaHref}
            className={cn('anf-cta', !isExpanded && 'anf-cta--hidden')}
          >
            {ctaLabel}
          </Link>
          {isAuthenticated && onLogout && (
            <motion.button
              variants={itemVariants}
              onClick={(e) => { e.stopPropagation(); onLogout() }}
              className={cn('anf-cta', !isExpanded && 'anf-cta--hidden')}
              title="Sign out"
              style={{ padding: '0 0.7rem', marginRight: '0.35rem' }}
            >
              <LogOut style={{ width: '0.85rem', height: '0.85rem' }} />
            </motion.button>
          )}
        </div>

        <div className="anf-center-icon-wrap">
          <motion.div variants={collapsedIconVariants} animate={isExpanded ? 'expanded' : 'collapsed'}>
            <Menu className="anf-center-icon" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  )
}
