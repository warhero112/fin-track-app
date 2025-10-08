'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, register } = useUser()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password)
        if (success) {
          onClose()
        } else {
          setError('Invalid email or password')
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }
        
        const success = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        
        if (success) {
          onClose()
        } else {
          setError('Registration failed. Please try again.')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
  }

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+81-90-1234-5678"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <span className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Forgot your password?
              </button>
            </div>
          )}

          {/* Demo Account Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <div className="font-medium mb-1">Demo Account:</div>
            <div>Email: demo@rentora.jp</div>
            <div>Password: demo123</div>
          </div>
        </div>
      </div>
    </div>
  )
}