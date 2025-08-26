import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Telescope, User, LogOut, LogIn, Menu, X } from 'lucide-react'
import AuthModal from './AuthModal'

const Header = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40 py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-lg">
                <Telescope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Cosmic Tracker</h1>
                <p className="text-xs text-gray-300 hidden sm:block">Near-Earth Object Monitor</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-cosmic-gold bg-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Events
              </Link>
              <Link
                to="/compare"
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/compare') 
                    ? 'text-cosmic-gold bg-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Compare
              </Link>
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 btn-secondary text-cosmic-gold hover:dark:bg-slate-800/[0.8] rounded-2xl p-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className='text-cosmic-gold'>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="btn-secondary text-cosmic-gold hover:dark:bg-slate-800/[0.8] rounded-2xl p-3"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="btn-primary  text-cosmic-gold hover:dark:bg-slate-800/[0.8] rounded-2xl p-3"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <nav className="space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-cosmic-gold bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Events
                </Link>
                <Link
                  to="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/compare') 
                      ? 'text-cosmic-gold bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Compare
                </Link>
              </nav>

              <div className="mt-4 pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-white px-3">
                      <User className="h-5 w-5" />
                      <span className="text-sm">{user.name || user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center space-x-2 btn-secondary"
                    >
                      <LogOut className="text-cosmic-gold h-4 w-4" />
                      <span className='text-cosmic-gold'>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 flex">
                    <button
                      onClick={() => handleAuthClick('signin')}
                      className="w-full font-bold text-white bg-cosmic-purple rounded-2xl p-2 btn-secondary"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}

export default Header