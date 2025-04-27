import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useParams } from 'react-router-dom';
import { apiService } from '../utils/apiHandler';
import VideoUploader from '../Components/VideoUploader';

export default function CourseModuleCreator() {

  const { courseId } = useParams();
  const { Token } = useAuth();

  const [allModules, setAllModules] = useState([]);
  const [module, setModule] = useState({
    CourseId: courseId,
    ModuleName: "",
    ModuleDescription: "",
    ModuleDuration: "",
    Videos: [],
    quizes: []
  });

  // State for currently selected module index from allModules
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);

  // State to track if we're editing an existing module or creating a new one
  const [isEditing, setIsEditing] = useState(false);

  // State for video upload
  const [videoUploading, setVideoUploading] = useState(false);

  // Fetch all modules on component mount
  // http://localhost:3000/api/chapter/course/6807d07c8bb1a8956e9d8814
  useEffect(() => {
    const fetchModules = async () => {
      const response = await apiService({
        method: 'GET',
        endpoint: `/chapter/course/${courseId}`,
        token: Token
      });
      setAllModules(response.chapters);
      console.log(allModules);
    }
    fetchModules();
  }, []);

  // Create a new empty module
  const createNewModule = () => {
    // setModule({
    //   CourseId: courseId,
    //   ModuleName: "",
    //   ModuleDescription: "",
    //   ModuleDuration: "",
    //   Videos: [],
    //   quizes: []
    // });
    // setIsEditing(false);
    // setCurrentModuleIndex(null);
    console.log("mf");
  };

  // Select an existing module to edit
  const selectModule = (index) => {
    setModule(allModules[index]);
    console.log(module);
    setCurrentModuleIndex(index);
    setIsEditing(true);
  };

  // Update current module state
  const updateModule = (field, value) => {
    setModule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a new video to current module
  const addVideo = () => {
    setModule(prev => ({
      ...prev,
      Videos: [
        ...prev.Videos,
        {
          videoName: "",
          videoDescription: "",
          videoDuration: "",
          videoId: ""
        }
      ]
    }));
  };

  // Update video details
  const updateVideo = (videoIndex, field, value) => {
    const updatedVideos = [...module.Videos];
    updatedVideos[videoIndex] = {
      ...updatedVideos[videoIndex],
      [field]: value
    };

    setModule(prev => ({
      ...prev,
      Videos: updatedVideos
    }));
  };

  // Simulate video upload and get ID
  const uploadVideo = async (videoIndex) => {
    // Mock response with video ID
    const videoId = `Video${Date.now()}`;

    // Update the video with the new ID
    const updatedVideos = [...module.Videos];
    updatedVideos[videoIndex] = {
      ...updatedVideos[videoIndex],
      videoId: videoId
    };

    setModule(prev => ({
      ...prev,
      Videos: updatedVideos
    }));

    alert(`Video uploaded successfully! ID: ${videoId}`);

    console.error("Error uploading video:", error);
    alert("Failed to upload video");

    setVideoUploading(false);
  };

  // Add a new quiz to current module
  const addQuiz = () => {
    setModule(prev => ({
      ...prev,
      quizes: [
        ...prev.quizes,
        {
          quizName: "",
          quizDiscription: "",
          quizDuration: "",
          quizLink: ""
        }
      ]
    }));
  };

  // Update quiz details
  const updateQuiz = (quizIndex, field, value) => {
    const updatedQuizzes = [...module.quizes];
    updatedQuizzes[quizIndex] = {
      ...updatedQuizzes[quizIndex],
      [field]: value
    };

    setModule(prev => ({
      ...prev,
      quizes: updatedQuizzes
    }));
  };

  // Submit the module
  const submitModule = async () => {
    // Validate module data
    if (!module.ModuleName) {
      alert("Please enter a module name");
      return;
    }

    if (module.Videos.length === 0 && module.quizes.length === 0) {
      alert("Please add at least one video or quiz to the module");
      return;
    }

    // Check if all videos have videoId (meaning they've been uploaded)
    const missingVideoIds = module.Videos.some(video => !video.videoId);
    if (missingVideoIds) {
      alert("Please upload all videos before submitting");
      return;
    }

    try {
      // For demonstration purposes, we'll simulate an API call
      console.log("Submitting module:", module);

      // Mock API call
      // In a real app, you would send the module data to your backend
      // const response = await fetch('api/modules', {
      //   method: isEditing ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(module)
      // });
      // const savedModule = await response.json();

      // Simulate successful save
      await new Promise(resolve => setTimeout(resolve, 500));

      const savedModule = {
        ...module,
        _id: isEditing ? module._id : `new-module-${Date.now()}`
      };

      // Update allModules state
      if (isEditing && currentModuleIndex !== null) {
        const updatedModules = [...allModules];
        updatedModules[currentModuleIndex] = savedModule;
        setAllModules(updatedModules);
      } else {
        setAllModules(prev => [...prev, savedModule]);
      }

      // Reset form for a new module
      createNewModule();

      alert(`Module successfully ${isEditing ? 'updated' : 'created'}!`);
    } catch (error) {
      console.error("Error submitting module:", error);
      alert("Failed to submit module");
    }
  };

  // Delete a module
  const deleteModule = async () => {
    if (!isEditing || currentModuleIndex === null) return;

    if (confirm('Are you sure you want to delete this module?')) {
      try {
        // In a real app, you would call your backend API to delete the module
        // await fetch(`api/modules/${module._id}`, { method: 'DELETE' });

        // Update local state
        const updatedModules = allModules.filter((_, index) => index !== currentModuleIndex);
        setAllModules(updatedModules);

        // Reset current module
        createNewModule();

        alert("Module deleted successfully");
      } catch (error) {
        console.error("Error deleting module:", error);
        alert("Failed to delete module");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 w-full">
      {/* Module Navigation */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Course Modules</h1>
          <button
            onClick={createNewModule}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create New Module
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {allModules.map((mod, index) => (
            <button
              key={mod._id}
              onClick={() => selectModule(index)}
              className={`px-4 py-2 rounded-full ${isEditing && currentModuleIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
                }`}
            >
              {mod.ModuleName || `Module ${index + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Module Editor */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? `Edit Module: ${module.ModuleName}` : "Create New Module"}
          </h2>
          {isEditing && (
            <button
              onClick={deleteModule}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
            >
              Delete
            </button>
          )}
        </div>

        {/* Module Details */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Module Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor='moduleName' className="block text-sm font-medium text-gray-700 mb-1">Module Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id='modeuleName'
                value={module.ModuleName}
                onChange={(e) => updateModule('ModuleName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter module name"
              />
            </div>
            <div>
              <label htmlFor='moduleDuration' className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                id='moduleDuration'
                value={module.ModuleDuration}
                onChange={(e) => updateModule('ModuleDuration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter duration (e.g., 45 min)"
              />
            </div>
          </div>
          <div>
            <label htmlFor='moduleDescription' className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id='moduleDescription'
              value={module.ModuleDescription}
              onChange={(e) => updateModule('ModuleDiscription', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded h-24"
              placeholder="Enter module description"
            />
          </div>
        </div>

        {/* Videos Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Videos</h3>
            <button
              onClick={addVideo}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
            >
              Add Video
            </button>
          </div>
          {module.Videos.length === 0 ? (
            <p className="text-gray-500">No videos added yet.</p>
          ) : (
            module.Videos.map((video, index) => (
              <div key={index} className="space-y-4">
                <div className="border border-gray-200 p-4 rounded bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Name</label>
                      <input
                        type="text"
                        value={video?.videoName}
                        onChange={(e) => updateVideo(index, 'videoName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter video name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={video?.videoDuration}
                        onChange={(e) => updateVideo(index, 'videoDuration', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter duration (e.g., 20 mins)"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={video?.videoDescription}
                      onChange={(e) => updateVideo(index, 'videoDescription', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter video description"
                    />
                  </div>
                  <VideoUploader
                  />
                </div>
              </div>
            ))
          )}

        </div>

        {/* Quizzes Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Quizzes</h3>
            <button
              onClick={addQuiz}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
            >
              Add Quiz
            </button>
          </div>

          {module.quizes.length === 0 ? (
            <p className="text-gray-500">No quizzes added yet.</p>
          ) : (
            <div className="space-y-4">
              {module.quizes.map((quiz, quizIndex) => (
                <div key={quizIndex} className="border border-gray-200 p-4 rounded bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Name</label>
                      <input
                        type="text"
                        value={quiz.quizName}
                        onChange={(e) => updateQuiz(quizIndex, 'quizName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter quiz name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={quiz.quizDuration}
                        onChange={(e) => updateQuiz(quizIndex, 'quizDuration', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter duration (e.g., 15 mins)"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={quiz.quizDiscription}
                      onChange={(e) => updateQuiz(quizIndex, 'quizDiscription', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter quiz description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Link</label>
                    <input
                      type="text"
                      value={quiz.quizLink}
                      onChange={(e) => updateQuiz(quizIndex, 'quizLink', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter quiz link"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={submitModule}
            className="py-3 px-8 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {isEditing ? 'Update Module' : 'Submit Module'}
          </button>
        </div>
      </div>
    </div>
  );
}