import React, { useState } from 'react'
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AuthModal = ({ isOpen, onClose, mode, onModeChange }) => {
  const { signIn, signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      let result
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password)
      }

      if (result.error) {
        setErrors({ general: result.error.message })
      } else {
        onClose()
        setFormData({ email: '', password: '', confirmPassword: '' })
        setErrors({})
      }
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' })
    setErrors({})
  }

  const switchMode = (newMode) => {
    onModeChange(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/20">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-300">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input w-full p-3 rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm group-hover:shadow-lg ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input w-full p-3 rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm group-hover:shadow-lg ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`input w-full p-3 rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm group-hover:shadow-lg ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl p-3 btn-primary bg-cosmic-purple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                  </span>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-gray-400 text-sm">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-cosmic-purple hover:text-cosmic-gold transition-colors text-sm font-medium"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthModal