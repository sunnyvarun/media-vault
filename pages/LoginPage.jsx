/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const LoginPage = () => {
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        '/api/login.php',
        { user_id: userId, name },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.status === 'success') {
        localStorage.setItem('userId', userId)
        navigate('/display', { replace: true })
      } else {
        setError(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-indigo-100 mt-2">Sign in to your creative space</p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">User ID</label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your unique ID"
                    required
                  />
                </motion.div>
              </div>
              
              <div className="mb-8">
                {/* <label className="block text-gray-700 font-medium mb-2">Your Name</label> */}
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="What should we call you?"
                    hidden
                  />
                </motion.div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                  isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Signing in...
                  </div>
                ) : 'Continue'}
              </motion.button>
            </form>

            <motion.div 
              className="mt-6 text-center text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Don't have an account? Just enter any id
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="mt-6 text-center text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your creative journey starts here
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default LoginPage