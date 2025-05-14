import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useCourse } from '../Context/CourseContext'; // Updated to use CourseContext
import { useParams } from 'react-router-dom';
import VideoUploader from '../Components/VideoUploader';

export default function CourseModuleCreator() {
  const { courseId } = useParams();
  const { Token } = useAuth();

  // Get course-related methods and data from the CourseContext
  const { useChapters, addChapter, updateChapter, deleteChapter } = useCourse();
  const { data: chapterData, isLoading, isError } = useChapters(courseId, Token);
  console.log(chapterData?.chapters);
  // Module state
  const [currentModule, setCurrentModule] = useState({
    CourseId: courseId,
    ModuleName: '',
    ModuleDescription: '',
    ModuleDuration: '',
    Videos: [],
    quizes: [],
  });

  // State to track if we're editing an existing module or creating a new one
  const [isEditing, setIsEditing] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  // Select an existing module to edit
  const selectModule = (index) => {
    setCurrentModule(chapterData?.chapters[index]);
    setCurrentModuleIndex(index);
    setIsEditing(true);
  };

  // Update current module state
  const updateModuleField = (field, value) => {
    setCurrentModule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add a new video to the current module
  const addVideo = () => {
    setCurrentModule((prev) => ({
      ...prev,
      Videos: [
        ...prev.Videos,
        {
          videoName: '',
          videoDescription: '',
          videoDuration: '',
          videoId: '',
        },
      ],
    }));
  };

  // Update video details
  const updateVideo = (videoIndex, field, value) => {
    const updatedVideos = [...currentModule.Videos];
    updatedVideos[videoIndex] = {
      ...updatedVideos[videoIndex],
      [field]: value,
    };
    setCurrentModule((prev) => ({
      ...prev,
      Videos: updatedVideos,
    }));
  };

  // Simulate video upload and get ID
  const uploadVideo = async (videoIndex) => {
    // Mock response with video ID
    const videoId = `Video${Date.now()}`;
    const updatedVideos = [...currentModule.Videos];
    updatedVideos[videoIndex] = {
      ...updatedVideos[videoIndex],
      videoId,
    };
    setCurrentModule((prev) => ({
      ...prev,
      Videos: updatedVideos,
    }));

    alert(`Video uploaded successfully! ID: ${videoId}`);
    setVideoUploading(false);
  };

  // Add a new quiz to the current module
  const addQuiz = () => {
    setCurrentModule((prev) => ({
      ...prev,
      quizzes: [
        ...prev.quizes,
        {
          quizName: '',
          quizDescription: '',
          quizDuration: '',
          quizLink: '',
        },
      ],
    }));
  };

  // Update quiz details
  const updateQuiz = (quizIndex, field, value) => {
    const updatedQuizzes = [...currentModule.quizzes];
    updatedQuizzes[quizIndex] = {
      ...updatedQuizzes[quizIndex],
      [field]: value,
    };
    setCurrentModule((prev) => ({
      ...prev,
      quizzes: updatedQuizzes,
    }));
  };

  // Submit the module
  const submitModule = async () => {
    if (!currentModule.ModuleName) {
      alert('Please enter a module name');
      return;
    }

    // if (currentModule.Videos.length === 0 && currentModule.quizes.length === 0) {
    //   alert('Please add at least one video or quiz to the module');
    //   return;
    // }

    // Check if all videos have videoId (meaning they've been uploaded)
    const missingVideoIds = currentModule.Videos.some((video) => !video.videoId);
    if (missingVideoIds) {
      alert('Please upload all videos before submitting');
      return;
    }

    try {
      const savedModule = {
        ...currentModule,
      };

      if (isEditing && currentModuleIndex !== null) {
        // Update the module
        await updateChapter.mutateAsync({
          courseId: courseId,
          updatedChapter: savedModule,
          token: Token,
        });
      } else {
        // Add a new module
        await addChapter.mutateAsync({
          newChapter: savedModule,
          token: Token
        });
      }

      resetModule();
      alert(`Module successfully ${isEditing ? 'updated' : 'created'}!`);
    } catch (error) {
      console.error('Error submitting module:', error);
      alert('Failed to submit module');
    }
  };

  // Delete a module
  const deleteModuleHandler = async () => {
    if (!isEditing || currentModuleIndex === null) return;

    if (confirm('Are you sure you want to delete this module?')) {
      try {
        const chapterId = chapterData.chapters[currentModuleIndex]._id; // use correct array
        await deleteChapter.mutateAsync({ chapterId, token: Token }); // pass correct key
        resetModule();
        alert('Module deleted successfully');
      } catch (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module');
      }
    }
  };


  // Reset the current module state
  const resetModule = () => {
    setCurrentModule({
      CourseId: courseId,
      ModuleName: '',
      ModuleDescription: '',
      ModuleDuration: '',
      Videos: [],
      quizes: [],
    });
    setIsEditing(false);
    setCurrentModuleIndex(null);
  };

  if (isLoading) return <div>Loading chapters...</div>;
  if (isError) return <div>Error loading chapters</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6 w-full">
      {/* Module Navigation */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Course Modules</h1>
          <button
            onClick={resetModule}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create New Module
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {chapterData?.chapters.map((mod, index) => (
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
            {isEditing ? `Edit Module: ${currentModule.ModuleName}` : 'Create New Module'}
          </h2>
          {isEditing && (
            <button
              onClick={deleteModuleHandler}
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
              <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                Module Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="moduleName"
                value={currentModule.ModuleName}
                onChange={(e) => updateModuleField('ModuleName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter module name"
              />
            </div>
            <div>
              <label htmlFor="moduleDuration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                id="moduleDuration"
                value={currentModule.ModuleDuration}
                onChange={(e) => updateModuleField('ModuleDuration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter duration (e.g., 45 min)"
              />
            </div>
          </div>
          <div>
            <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="moduleDescription"
              value={currentModule.ModuleDescription}
              onChange={(e) => updateModuleField('ModuleDescription', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter module description"
            />
          </div>
        </div>

        {/* Video Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Videos</h3>
          {currentModule.Videos.length === 0 && (
            <p className="text-gray-500">No videos added yet.</p>
          )}

          {currentModule.Videos.map((video, index) => (
            <div key={index} className="mb-4">
              <VideoUploader
                video={video}
                videoIndex={index}
                updateVideo={updateVideo}
                uploadVideo={uploadVideo}
                videoUploading={videoUploading}
              />
            </div>
          ))}

          <button
            onClick={addVideo}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-2"
          >
            Add Video
          </button>
        </div>

        {/* Quiz Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Quizzes</h3>
          {currentModule.quizes.length === 0 && (
            <p className="text-gray-500">No quizzes added yet.</p>
          )}

          {currentModule.quizes.map((quiz, index) => (
            <div key={index} className="mb-4">
              {/* Quiz form elements */}
              <div>
                <label htmlFor={`quizName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Name
                </label>
                <input
                  type="text"
                  id={`quizName-${index}`}
                  value={quiz.quizName}
                  onChange={(e) => updateQuiz(index, 'quizName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Other quiz details */}
            </div>
          ))}

          <button
            onClick={addQuiz}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mt-2"
          >
            Add Quiz
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={submitModule}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
          >
            {isEditing ? 'Update Module' : 'Create Module'}
          </button>
        </div>
      </div>
    </div>
  );
}
