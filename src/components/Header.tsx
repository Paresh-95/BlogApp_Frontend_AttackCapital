'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import axios from 'axios'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Track login state
  const pathname = usePathname()
  const router = useRouter()
  let lastScrollY = 0

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) 
      } else {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
      setIsScrolled(currentScrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)


  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/isAuth`, { withCredentials: true })
        setIsLoggedIn(response.data.success)
      } catch {
        setIsLoggedIn(false)
      }
    }
    fetchAuthState()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`,{ withCredentials: true })
      setIsLoggedIn(false)
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black text-white transition-transform duration-300",
        isScrolled && "bg-black/80 backdrop-blur-sm shadow-md",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-colors hover:text-gray-300">
              SHORTCUT
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/" isActive={pathname === '/'}>Home</NavLink>
            <NavLink href="/dashboard" isActive={pathname === '/dashboard'}>Dashboard</NavLink>
            {!isLoggedIn ? (
              <NavLink href="/login" isActive={pathname === '/login'}>Login</NavLink>
            ) : (
              <button onClick={handleLogout} className="text-lg text-gray-300 hover:text-white transition-colors">
                Logout
              </button>
            )}
          </nav>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-black">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink href="/" isActive={pathname === '/'} onClick={toggleMenu}>Home</NavLink>
            <NavLink href="/dashboard" isActive={pathname === '/dashboard'} onClick={toggleMenu}>Dashboard</NavLink>
            {!isLoggedIn ? (
              <NavLink href="/login" isActive={pathname === '/login'} onClick={toggleMenu}>Login</NavLink>
            ) : (
              <button onClick={handleLogout} className="text-lg text-gray-300 hover:text-white transition-colors">
                Logout
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

function NavLink({ href, children, isActive, onClick }: { href: string; children: React.ReactNode; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-lg transition-colors",
        isActive ? "text-white font-semibold" : "text-gray-300 hover:text-white"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
