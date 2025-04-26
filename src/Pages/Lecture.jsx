import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Clock, Film, BookOpen, X, Trash, Play } from 'lucide-react';

export default function CourseManagement() {
  // Initial data

  // State for modules
  const [modules, setModules] = useState([initialData]);
  const [expandedModules, setExpandedModules] = useState([0]);
  
  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);
  
  // Form states
  const [moduleForm, setModuleForm] = useState({
    ModuleName: '',
    ModuleDiscription: '',
    ModuleDuration: ''
  });
  
  const [videoForm, setVideoForm] = useState({
    videoName: '',
    videoDiscription: '',
    videoDuration: '',
    videoFile: null,
    videoUrl: ''
  });
  
  const [quizForm, setQuizForm] = useState({
    quizName: '',
    quizDiscription: '',
    quizDuration: '',
    quizLink: ''
  });

  // State for video player
  const [activeVideo, setActiveVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Toggle module expansion
  const toggleModule = (index) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter(i => i !== index));
    } else {
      setExpandedModules([...expandedModules, index]);
    }
  };

  // Handle module form inputs
  const handleModuleFormChange = (e) => {
    const { name, value } = e.target;
    setModuleForm({
      ...moduleForm,
      [name]: value
    });
  };

  // Handle video form inputs
  const handleVideoFormChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        // Create a temporary URL for preview
        const fileUrl = URL.createObjectURL(file);
        setVideoForm({
          ...videoForm,
          videoFile: file,
          videoUrl: fileUrl
        });
      }
    } else {
      setVideoForm({
        ...videoForm,
        [name]: value
      });
    }
  };

  // Handle quiz form inputs
  const handleQuizFormChange = (e) => {
    const { name, value } = e.target;
    setQuizForm({
      ...quizForm,
      [name]: value
    });
  };

  // Add new module
  const handleAddModule = (e) => {
    e.preventDefault();
    
    const newModule = {
      CourseId: "6807d07c8bb1a8956e9d8814", // Using same CourseId as sample
      ...moduleForm,
      Videos: [],
      quizes: []
    };
    
    setModules([...modules, newModule]);
    setShowModuleModal(false);
    setExpandedModules([...expandedModules, modules.length]);
    
    // Reset form
    setModuleForm({
      ModuleName: '',
      ModuleDiscription: '',
      ModuleDuration: ''
    });
  };

  // Add new video
  const handleAddVideo = (e) => {
    e.preventDefault();
    
    // In a real application, you would upload the file to a server here
    // and get back a permanent URL to store
    
    const videoData = {
      videoName: videoForm.videoName,
      videoDiscription: videoForm.videoDiscription,
      videoDuration: videoForm.videoDuration,
      videoUrl: videoForm.videoUrl // In real app, this would be the URL from the server
    };
    
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].Videos.push(videoData);
    
    setModules(updatedModules);
    setShowContentModal(false);
    
    // Reset form
    setVideoForm({
      videoName: '',
      videoDiscription: '',
      videoDuration: '',
      videoFile: null,
      videoUrl: ''
    });
  };

  // Add new quiz
  const handleAddQuiz = (e) => {
    e.preventDefault();
    
    const updatedModules = [...modules];
    updatedModules[currentModuleIndex].quizes.push(quizForm);
    
    setModules(updatedModules);
    setShowContentModal(false);
    
    // Reset form
    setQuizForm({
      quizName: '',
      quizDiscription: '',
      quizDuration: '',
      quizLink: ''
    });
  };

  // Open content modal
  const openContentModal = (index) => {
    setCurrentModuleIndex(index);
    setShowContentModal(true);
  };

  // Delete module
  const deleteModule = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
    setExpandedModules(expandedModules.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  // Delete video
  const deleteVideo = (moduleIndex, videoIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].Videos = updatedModules[moduleIndex].Videos.filter((_, i) => i !== videoIndex);
    setModules(updatedModules);
  };

  // Delete quiz
  const deleteQuiz = (moduleIndex, quizIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].quizes = updatedModules[moduleIndex].quizes.filter((_, i) => i !== quizIndex);
    setModules(updatedModules);
  };

  // Open video player
  const playVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
    setShowVideoPlayer(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Course Management System</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Course Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-600">Web Development Fundamentals</h2>
          <button 
            onClick={() => setShowModuleModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add New Module
          </button>
        </div>
        
        {/* Modules Container */}
        <div>
          {modules.map((module, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              {/* Module Header */}
              <div 
                className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                onClick={() => toggleModule(index)}
              >
                <div>
                  <h3 className="text-lg font-medium text-blue-600">{module.ModuleName}</h3>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-sm text-gray-500 flex items-center">
                    <Clock size={16} className="mr-1" /> {module.ModuleDuration}
                  </div>
                  {expandedModules.includes(index) ? 
                    <ChevronUp size={20} className="text-gray-500" /> : 
                    <ChevronDown size={20} className="text-gray-500" />
                  }
                </div>
              </div>
              
              {/* Module Content */}
              {expandedModules.includes(index) && (
                <div className="p-4">
                  <div className="mb-4 text-gray-600">
                    <p>{module.ModuleDiscription}</p>
                  </div>
                  
                  {/* Module Actions */}
                  <div className="flex mb-6 gap-2">
                    <button 
                      onClick={() => openContentModal(index)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> Add Content
                    </button>
                    <button 
                      onClick={() => deleteModule(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <Trash size={16} className="mr-1" /> Delete Module
                    </button>
                  </div>
                  
                  {/* Videos Section */}
                  {module.Videos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-3 flex items-center">
                        <Film size={18} className="mr-2 text-blue-500" /> Videos
                      </h4>
                      <div className="space-y-3">
                        {module.Videos.map((video, videoIndex) => (
                          <div key={videoIndex} className="border-l-4 border-blue-500 bg-gray-50 p-3 rounded-r-md">
                            <div className="flex justify-between">
                              <h5 className="font-medium">{video.videoName}</h5>
                              <button 
                                onClick={() => deleteVideo(index, videoIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{video.videoDiscription}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <Clock size={14} className="mr-1" /> {video.videoDuration}
                            </div>
                            <div className="mt-2">
                              <button
                                onClick={() => playVideo(video.videoUrl)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center w-24"
                              >
                                <Play size={14} className="mr-1" /> Play Video
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Quizzes Section */}
                  {module.quizes.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium mb-3 flex items-center">
                        <BookOpen size={18} className="mr-2 text-green-500" /> Quizzes
                      </h4>
                      <div className="space-y-3">
                        {module.quizes.map((quiz, quizIndex) => (
                          <div key={quizIndex} className="border-l-4 border-green-500 bg-gray-50 p-3 rounded-r-md">
                            <div className="flex justify-between">
                              <h5 className="font-medium">{quiz.quizName}</h5>
                              <button 
                                onClick={() => deleteQuiz(index, quizIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{quiz.quizDiscription}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <Clock size={14} className="mr-1" /> {quiz.quizDuration}
                            </div>
                            <div className="mt-2">
                              <a 
                                href={quiz.quizLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Open Quiz
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Module</h3>
              <button onClick={() => setShowModuleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddModule}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Module Name</label>
                <input
                  type="text"
                  name="ModuleName"
                  value={moduleForm.ModuleName}
                  onChange={handleModuleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Description</label>
                <textarea
                  name="ModuleDiscription"
                  value={moduleForm.ModuleDiscription}
                  onChange={handleModuleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name="ModuleDuration"
                  value={moduleForm.ModuleDuration}
                  onChange={handleModuleFormChange}
                  placeholder="e.g. 45 min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Content</h3>
              <button onClick={() => setShowContentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'video' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('video')}
              >
                Video
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('quiz')}
              >
                Quiz
              </button>
            </div>
            
            {/* Video Form */}
            {activeTab === 'video' && (
              <form onSubmit={handleAddVideo}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Video Title</label>
                  <input
                    type="text"
                    name="videoName"
                    value={videoForm.videoName}
                    onChange={handleVideoFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Description</label>
                  <textarea
                    name="videoDiscription"
                    value={videoForm.videoDiscription}
                    onChange={handleVideoFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    name="videoDuration"
                    value={videoForm.videoDuration}
                    onChange={handleVideoFormChange}
                    placeholder="e.g. 20 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Upload Video</label>
                  <div className="mt-1 flex items-center">
                    <label className="block w-full">
                      <span className="sr-only">Choose video file</span>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={handleVideoFormChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                        required
                      />
                    </label>
                  </div>
                </div>
                {videoForm.videoUrl && (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">Video Preview</label>
                    <div className="mt-1 bg-gray-100 rounded-md p-2">
                      <video 
                        src={videoForm.videoUrl} 
                        controls 
                        className="w-full h-48 object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowContentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Video
                  </button>
                </div>
              </form>
            )}
            
            {/* Quiz Form */}
            {activeTab === 'quiz' && (
              <form onSubmit={handleAddQuiz}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Quiz Title</label>
                  <input
                    type="text"
                    name="quizName"
                    value={quizForm.quizName}
                    onChange={handleQuizFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Description</label>
                  <textarea
                    name="quizDiscription"
                    value={quizForm.quizDiscription}
                    onChange={handleQuizFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    name="quizDuration"
                    value={quizForm.quizDuration}
                    onChange={handleQuizFormChange}
                    placeholder="e.g. 20 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Quiz Link</label>
                  <input
                    type="url"
                    name="quizLink"
                    value={quizForm.quizLink}
                    onChange={handleQuizFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowContentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Quiz
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Video Player Modal */}
      {showVideoPlayer && activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Video Player</h3>
              <button 
                onClick={() => {
                  setShowVideoPlayer(false);
                  setActiveVideo(null);
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="w-full">
              <video 
                src={activeVideo}
                controls
                autoPlay
                className="w-full rounded-md"
                style={{ maxHeight: '70vh' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}