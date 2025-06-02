/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Upload, X, ArrowLeft, Loader2 } from 'lucide-react'

const UploadPage = () => {
  const [textContent, setTextContent] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setMediaFile(file)
    
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!userId) {
      setError('Please login first')
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('user_id', userId)
    formData.append('text_content', textContent)
    if (mediaFile) {
      formData.append('media_file', mediaFile)
    }

    try {
      await axios.post('/api/upload.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      navigate('/display')
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/display')}
            className="p-3 bg-white rounded-full shadow-md mr-4"
          >
            <ArrowLeft size={20} className="text-indigo-600" />
          </motion.button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Share Your Creation
          </h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {error && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-red-100 text-red-700 rounded-t-lg"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">Your Story</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] resize-none"
                placeholder="What's on your mind? Share your thoughts..."
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">Add Media</label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  preview ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-gray-50'
                }`}
              >
                {preview ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        setMediaFile(null)
                        setPreview(null)
                      }}
                      className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg border border-gray-200 z-10"
                    >
                      <X size={18} className="text-red-500" />
                    </motion.button>
                    {mediaFile.type.startsWith('image/') ? (
                      <motion.img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-72 mx-auto rounded-lg shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    ) : (
                      <motion.video 
                        src={preview} 
                        controls 
                        className="max-h-72 mx-auto rounded-lg shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.label 
                    className="cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Upload size={28} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-600 mb-1 font-medium">Click to upload</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF, MP4 up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,video/*"
                    />
                  </motion.label>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <motion.button
                type="button"
                onClick={() => navigate('/display')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.03 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                className={`px-6 py-3 text-white rounded-xl transition-all duration-200 ${
                  isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Uploading...
                  </div>
                ) : 'Share Now'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UploadPage