/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, LogOut, Loader2, Image, Video, FileText, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

const DisplayPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts.php?user_id=${userId}`);
        const filteredPosts = response.data.filter(post => 
          post.media_path || post.text_content?.trim()
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigatePost = (direction) => {
    const currentIndex = posts.findIndex(post => post.id === selectedPost.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % posts.length;
    } else {
      newIndex = (currentIndex - 1 + posts.length) % posts.length;
    }
    
    setSelectedPost(posts[newIndex]);
  };

  const handleDelete = async (postId, e) => {
    if (e) e.stopPropagation(); // Only stop propagation if event exists
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        const response = await axios.delete(`/api/posts.php?post_id=${postId}`);
        
        if (response.data && response.data.success) {
          setPosts(posts.filter(post => post.id !== postId));
          if (selectedPost && selectedPost.id === postId) {
            closeModal();
          }
          setError(''); // Clear any previous errors
        } else {
          setError('Failed to delete post. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
};

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 flex items-center justify-center"
        >
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-indigo-900 font-medium"
        >
          Loading your content...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8"
    >
      {/* Floating action buttons */}
      <motion.div 
        className="fixed bottom-8 right-8 z-10 flex flex-col space-y-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upload')}
          className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Plus size={24} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-4 bg-white text-red-500 rounded-full shadow-lg flex items-center justify-center border border-red-200"
        >
          <LogOut size={24} />
        </motion.button>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Your Digital Gallery
          </h1>
          <p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
            {posts.length > 0 
              ? `You have ${posts.length} beautiful ${posts.length === 1 ? 'piece' : 'pieces'} of content`
              : "Your creative space is waiting for your first masterpiece"}
          </p>
        </motion.header>

        {error && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl shadow-sm max-w-2xl mx-auto text-center"
          >
            {error}
          </motion.div>
        )}

        {posts.length === 0 ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="text-indigo-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Gallery is Empty</h2>
            <p className="text-gray-500 mb-6">Start by uploading your first content to see it displayed here beautifully.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Upload Your First Content
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id || index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                onClick={() => openModal(post)}
              >
                {/* Delete button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDelete(post.id, e)}
                  className="absolute top-2 right-2 z-10 p-2 bg-red-100 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>

                {post.media_path ? (
                  <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                    {post.media_path.match(/\.(mp4|mov|avi|webm)$/i) ? (
                      <>
                        <video 
                          src={`http://localhost/server/${post.media_path}`} 
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                          loop
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Video className="text-white/80" size={48} />
                        </div>
                      </>
                    ) : (
                      <img 
                        src={`http://localhost/server/${post.media_path}`} 
                        alt="Uploaded media" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    <FileText className="text-indigo-400" size={48} />
                  </div>
                )}
                <div className="p-5">
                  {post.text_content && (
                    <p className="text-gray-700 line-clamp-2 mb-3">
                      {post.text_content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for full view */}
      <AnimatePresence>
        {isModalOpen && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Delete button in modal */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(selectedPost.id, e);
                }}
                className="absolute top-4 left-4 z-20 p-2 bg-white-100 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} />
                    </>
                  )}
              </button>

              {posts.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePost('prev');
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePost('next');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="flex-1 border-gray-200 flex items-center justify-center p-8 bg-white-100 overflow-hidden">
                {selectedPost.media_path ? (
                  selectedPost.media_path.match(/\.(mp4|mov|avi|webm)$/i) ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <video 
                        src={`http://localhost/server/${selectedPost.media_path}`} 
                        controls 
                        className="max-h-full max-w-full object-contain"
                        autoPlay
                      />
                    </div>
                  ) : (
                    <div className="w-full  h-full flex items-center justify-center">
                      <img 
                        src={`http://localhost/server/${selectedPost.media_path}`} 
                        alt="Uploaded media" 
                        className="max-h-full  max-w-full object-contain"
                        style={{ maxHeight: '70vh' }}
                      />
                    </div>
                  )
                ) : (
                  <div className="p-8  text-center w-full">
                    <FileText className="mx-auto text-indigo-400 mb-4" size={64} />
                    <p className="text-gray-700 text-lg whitespace-pre-line">
                      {selectedPost.text_content}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                {selectedPost.text_content && selectedPost.media_path && (
                  <p className="text-gray-700 whitespace-pre-line mb-4">
                    {selectedPost.text_content}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(selectedPost.created_at).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DisplayPage;