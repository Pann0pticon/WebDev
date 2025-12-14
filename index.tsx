import React, { useState, useEffect } from 'react';
import { Play, Pause, Upload, Save, Trash2, Edit2, DollarSign, Book, Mic, Heart, MessageCircle, Send } from 'lucide-react';

export default function JewishPodcastPlatform() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [donationAmount, setDonationAmount] = useState('18');
  const [showComments, setShowComments] = useState(null);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  
  // New episode form
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    audioUrl: '',
    videoUrl: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // New blog post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const episodesData = await window.storage.get('episodes');
      const blogData = await window.storage.get('blog_posts');
      const commentsData = await window.storage.get('comments');
      
      if (episodesData) setEpisodes(JSON.parse(episodesData.value));
      if (blogData) setBlogPosts(JSON.parse(blogData.value));
      if (commentsData) setComments(JSON.parse(commentsData.value));
    } catch (error) {
      console.log('No existing data found');
    }
  };

  const saveData = async () => {
    try {
      await window.storage.set('episodes', JSON.stringify(episodes));
      await window.storage.set('blog_posts', JSON.stringify(blogPosts));
      await window.storage.set('comments', JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    if (episodes.length > 0 || blogPosts.length > 0 || Object.keys(comments).length > 0) {
      saveData();
    }
  }, [episodes, blogPosts, comments]);

  const handleAdminLogin = () => {
    if (adminPassword === 'torah5784') {
      setIsAdmin(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const addEpisode = () => {
    if (!newEpisode.title || !newEpisode.audioUrl) {
      alert('Please provide at least a title and audio URL');
      return;
    }
    
    const episode = {
      id: Date.now(),
      ...newEpisode,
      plays: 0
    };
    
    setEpisodes([episode, ...episodes]);
    setNewEpisode({
      title: '',
      description: '',
      audioUrl: '',
      videoUrl: '',
      duration: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteEpisode = (id) => {
    if (confirm('Are you sure you want to delete this episode?')) {
      setEpisodes(episodes.filter(ep => ep.id !== id));
    }
  };

  const addBlogPost = () => {
    if (!newPost.title || !newPost.content) {
      alert('Please provide a title and content');
      return;
    }
    
    const post = {
      id: Date.now(),
      ...newPost
    };
    
    setBlogPosts([post, ...blogPosts]);
    setNewPost({
      title: '',
      content: '',
      author: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteBlogPost = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setBlogPosts(blogPosts.filter(post => post.id !== id));
    }
  };

  const togglePlay = (episodeId) => {
    setCurrentlyPlaying(currentlyPlaying === episodeId ? null : episodeId);
  };

  const handleDonation = () => {
    alert(`Thank you for your generous donation of ${donationAmount}!\n\nIn a production environment, this would redirect to a secure payment processor like Stripe or PayPal.`);
  };

  const addComment = (episodeId) => {
    if (!newComment.name.trim() || !newComment.text.trim()) {
      alert('Please provide your name and comment');
      return;
    }

    const comment = {
      id: Date.now(),
      episodeId,
      name: newComment.name.trim(),
      text: newComment.text.trim(),
      date: new Date().toLocaleDateString()
    };

    setComments({
      ...comments,
      [episodeId]: [...(comments[episodeId] || []), comment]
    });

    setNewComment({ name: '', text: '' });
  };

  const deleteComment = (episodeId, commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setComments({
        ...comments,
        [episodeId]: comments[episodeId].filter(c => c.id !== commentId)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Abraham's Cave</h1>
                <p className="text-blue-200 text-sm">Jewish Learning Podcast</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('home')}
                className={`hover:text-blue-200 transition ${activeTab === 'home' ? 'border-b-2 border-white' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('episodes')}
                className={`hover:text-blue-200 transition ${activeTab === 'episodes' ? 'border-b-2 border-white' : ''}`}
              >
                Episodes
              </button>
              <button 
                onClick={() => setActiveTab('blog')}
                className={`hover:text-blue-200 transition ${activeTab === 'blog' ? 'border-b-2 border-white' : ''}`}
              >
                Blog
              </button>
              <button 
                onClick={() => setActiveTab('donate')}
                className={`hover:text-blue-200 transition ${activeTab === 'donate' ? 'border-b-2 border-white' : ''}`}
              >
                Donate
              </button>
              {!isAdmin && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`hover:text-blue-200 transition ${activeTab === 'admin' ? 'border-b-2 border-white' : ''}`}
                >
                  Admin
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Welcome to Abraham's Cave</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Join us on a journey through Jewish wisdom, tradition, and spirituality. Our podcast explores 
                Torah teachings, Jewish philosophy, and practical guidance for living a meaningful Jewish life.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Mic className="w-12 h-12 text-blue-900 mb-3" />
                  <h3 className="font-bold text-xl mb-2">Audio & Video</h3>
                  <p className="text-gray-600">New Torah insights and discussions</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Book className="w-12 h-12 text-blue-900 mb-3" />
                  <h3 className="font-bold text-xl mb-2">Written Content</h3>
                  <p className="text-gray-600">Deep dives into Jewish texts</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Heart className="w-12 h-12 text-blue-900 mb-3" />
                  <h3 className="font-bold text-xl mb-2">Community Support</h3>
                  <p className="text-gray-600">Help us continue our mission</p>
                </div>
              </div>
            </div>

            {episodes.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Latest Episode</h3>
                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="text-xl font-semibold mb-2">{episodes[0].title}</h4>
                  <p className="text-gray-600 mb-3">{episodes[0].description}</p>
                  <button 
                    onClick={() => setActiveTab('episodes')}
                    className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    Listen Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Podcast Episodes</h2>
              
              {isAdmin && (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Add New Episode</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Episode Title"
                      value={newEpisode.title}
                      onChange={(e) => setNewEpisode({...newEpisode, title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <textarea
                      placeholder="Episode Description"
                      value={newEpisode.description}
                      onChange={(e) => setNewEpisode({...newEpisode, description: e.target.value})}
                      className="w-full p-3 border rounded-lg h-24"
                    />
                    <input
                      type="text"
                      placeholder="Audio URL (required)"
                      value={newEpisode.audioUrl}
                      onChange={(e) => setNewEpisode({...newEpisode, audioUrl: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Video URL (optional)"
                      value={newEpisode.videoUrl}
                      onChange={(e) => setNewEpisode({...newEpisode, videoUrl: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Duration (e.g., 45:30)"
                        value={newEpisode.duration}
                        onChange={(e) => setNewEpisode({...newEpisode, duration: e.target.value})}
                        className="flex-1 p-3 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={newEpisode.date}
                        onChange={(e) => setNewEpisode({...newEpisode, date: e.target.value})}
                        className="flex-1 p-3 border rounded-lg"
                      />
                    </div>
                    <button 
                      onClick={addEpisode}
                      className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Add Episode
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {episodes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No episodes yet. Check back soon!</p>
                ) : (
                  episodes.map(episode => (
                    <div key={episode.id} className="border rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-blue-900">{episode.title}</h3>
                          <p className="text-sm text-gray-500">{episode.date} • {episode.duration}</p>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => deleteEpisode(episode.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4">{episode.description}</p>
                      <div className="flex gap-3 mb-4">
                        <button 
                          onClick={() => togglePlay(episode.id)}
                          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                        >
                          {currentlyPlaying === episode.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {currentlyPlaying === episode.id ? 'Pause' : 'Play'} Audio
                        </button>
                        {episode.videoUrl && (
                          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                            Watch Video
                          </button>
                        )}
                        <button 
                          onClick={() => setShowComments(showComments === episode.id ? null : episode.id)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Discussion ({(comments[episode.id] || []).length})
                        </button>
                      </div>

                      {/* Comments Section */}
                      {showComments === episode.id && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold mb-4">Discussion & Comments</h4>
                          
                          {/* Add Comment Form */}
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <input
                              type="text"
                              placeholder="Your name"
                              value={newComment.name}
                              onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                              className="w-full p-2 border rounded-lg mb-2"
                            />
                            <textarea
                              placeholder="Share your thoughts on this episode..."
                              value={newComment.text}
                              onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                              className="w-full p-2 border rounded-lg mb-2 h-20"
                            />
                            <button
                              onClick={() => addComment(episode.id)}
                              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Post Comment
                            </button>
                          </div>

                          {/* Display Comments */}
                          <div className="space-y-3">
                            {(comments[episode.id] || []).length === 0 ? (
                              <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
                            ) : (
                              (comments[episode.id] || []).map(comment => (
                                <div key={comment.id} className="bg-white border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <span className="font-semibold text-blue-900">{comment.name}</span>
                                      <span className="text-gray-500 text-sm ml-2">{comment.date}</span>
                                    </div>
                                    {isAdmin && (
                                      <button 
                                        onClick={() => deleteComment(episode.id, comment.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-gray-700">{comment.text}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Torah Insights & Articles</h2>
              
              {isAdmin && (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Post Title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                    <textarea
                      placeholder="Post Content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="w-full p-3 border rounded-lg h-48"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Author Name"
                        value={newPost.author}
                        onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                        className="flex-1 p-3 border rounded-lg"
                      />
                      <input
                        type="date"
                        value={newPost.date}
                        onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                        className="flex-1 p-3 border rounded-lg"
                      />
                    </div>
                    <button 
                      onClick={addBlogPost}
                      className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Publish Post
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {blogPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No blog posts yet. Check back soon!</p>
                ) : (
                  blogPosts.map(post => (
                    <article key={post.id} className="border-b pb-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-blue-900 mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-500">
                            By {post.author || 'Admin'} • {post.date}
                          </p>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => deleteBlogPost(post.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Donate Tab */}
        {activeTab === 'donate' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Support Our Mission</h2>
              <p className="text-gray-700 mb-6">
                Your generous support helps us continue sharing Torah wisdom and Jewish learning with 
                communities around the world. Every contribution, no matter the size, makes a difference.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Make a Donation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Amount ($)</label>
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {['18', '36', '72', '180'].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setDonationAmount(amount)}
                          className={`p-3 rounded-lg border-2 transition ${
                            donationAmount === amount 
                              ? 'border-blue-900 bg-blue-900 text-white' 
                              : 'border-gray-300 hover:border-blue-900'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <button 
                    onClick={handleDonation}
                    className="w-full bg-blue-900 text-white px-6 py-4 rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 text-lg font-semibold"
                  >
                    <Heart className="w-6 h-6" />
                    Donate ${donationAmount}
                  </button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    🔒 Secure payment processing
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Why Your Support Matters</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Free Torah education for all</li>
                  <li>✓ Quality audio and video production</li>
                  <li>✓ Hosting and technology costs</li>
                  <li>✓ Expanding our reach to new communities</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Admin Login */}
        {activeTab === 'admin' && !isAdmin && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Admin Login</h2>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full p-3 border rounded-lg"
                />
                <button 
                  onClick={handleAdminLogin}
                  className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
                >
                  Login
                </button>
                <p className="text-sm text-gray-500 text-center">
                  Demo password: torah5784
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="mb-2">© 2024 Abraham's Cave Podcast. All rights reserved.</p>
            <p className="text-blue-200 text-sm">
              Spreading Torah wisdom and Jewish learning to the world
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}