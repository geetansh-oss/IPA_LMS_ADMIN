import React from 'react';
import PropTypes from 'prop-types';

const ChapterForm = ({
  currentModule,
  setCurrentModule,
  isEditing,
  setIsEditing,
  addChapter,
  updateChapter,
  deleteChapter,
  courseId,
  Token,
  currentModuleIndex,
  chapterData
}) => {

  const updateModuleField = (field, value) => {
    setCurrentModule((prev) => ({ ...prev, [field]: value }));
  };

  const cleanObject = (obj) => {
    const newObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newObj[key] = value;
      }
    });
    return newObj;
  };

  const submitModule = async () => {
    if (!currentModule.ModuleName) {
      alert('Please enter a module name');
      return;
    }
    const missingVideoIds = currentModule?.Videos?.some((video) => !video.videoId);
    if (missingVideoIds) {
      alert('Please upload all videos before submitting');
      return;
    }
    try {
      const cleanedVideos = currentModule?.Videos?.map(video => cleanObject(video));
      const cleanedQuizzes = currentModule?.quizes?.map(quiz => cleanObject(quiz));
      const payload = cleanObject({
        ...currentModule,
        CourseId: courseId,
        Videos: cleanedVideos,
        quizes: cleanedQuizzes,
      });

      if (isEditing && currentModuleIndex !== null) {
        await updateChapter.mutateAsync({ courseId, updatedChapter: payload, token: Token });
      } else {
        await addChapter.mutateAsync({ newChapter: payload, token: Token });
      }
      console.log(`Module ${isEditing ? 'updated' : 'created'}`);
    } catch (error) {
      console.error('Error submitting module:', error);
    }
  };

  const deleteModuleHandler = async () => {
    if (!isEditing || currentModuleIndex === null) return;
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const chapterId = chapterData.chapters[currentModuleIndex]._id;
      await deleteChapter.mutateAsync({ chapterId, token: Token });
      resetModule();
      console.log('Module deleted successfully');
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const resetModule = () => {
    setCurrentModule({
      CourseId: courseId,
      ModuleName: '',
      ModuleDuration: '',
      ModuleDescription: '',
      Videos: [],
      quizes: [],
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {isEditing ? `Edit Module: ${currentModule?.ModuleName}` : 'Create New Module'}
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

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Module Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="moduleName" className="block text-sm font-medium mb-1">
              Module Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="moduleName"
              value={currentModule?.ModuleName}
              onChange={(e) => updateModuleField('ModuleName', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="moduleDuration" className="block text-sm font-medium mb-1">
              Duration
            </label>
            <input
              type="text"
              id="moduleDuration"
              value={currentModule?.ModuleDuration}
              onChange={(e) => updateModuleField('ModuleDuration', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label htmlFor="moduleDescription" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="moduleDescription"
            value={currentModule?.ModuleDescription}
            onChange={(e) => updateModuleField('ModuleDescription', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {isEditing && (
        <>
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Videos</h3>
            {chapterData?.chapters[currentModuleIndex]?.Videos?.length > 0 ? (
              <ul className="list-disc pl-5 mb-4">
                {currentModule.Videos.map((video, index) => (
                  <li key={index} className="mb-2">
                    {video.videoName || `Video ${index + 1}`}
                    <button
                      onClick={() => {
                        const updatedVideos = currentModule.Videos.filter((_, i) => i !== index);
                        updateModuleField('Videos', updatedVideos);
                      }}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-2">
                No videos added yet. Click below to add videos.
              </p>
            )}
            <button
              onClick={() => alert('Add Video modal here')}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Add Videos
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Quizzes</h3>
            <p className="text-sm text-gray-500 mb-2">
              Add quizzes related to this module.
            </p>
            <button
              onClick={() => alert('Add Quiz modal here')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
            >
              Add Quiz
            </button>
          </div>
        </>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={submitModule}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
        >
          {isEditing ? 'Update Module' : 'Create Module'}
        </button>
      </div>
    </div>
  );
};

ChapterForm.propTypes = {
  currentModule: PropTypes.object.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  addChapter: PropTypes.object.isRequired,
  updateChapter: PropTypes.object.isRequired,
  deleteChapter: PropTypes.object.isRequired,
  courseId: PropTypes.string.isRequired,
  Token: PropTypes.string.isRequired,
  currentModuleIndex: PropTypes.number,
  chapterData: PropTypes.object.isRequired,
};

export default ChapterForm;
