import { useState } from 'react';
import PropTypes from 'prop-types';
import AddVideo from '../Modal/AddVideo';

const VideoForm = ({ currentModule, setCurrentModule, currentModuleIndex, chapterData }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openVideoModal = (index = null) => {
    setEditIndex(index);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setEditIndex(null);
  };

  const deleteVideo = (index) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const updatedVideos = currentModule.Videos.filter((_, i) => i !== index);
      setCurrentModule(prev => ({
        ...prev,
        Videos: updatedVideos
      }));
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Videos</h3>
      
      {currentModule?.Videos?.length > 0 ? (
        <div className="space-y-2 mb-4">
          {currentModule.Videos.map((video, index) => (
            <div
              key={video.videoId || video.videoName || index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded border"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{video.videoName}</p>
                <p className="text-sm text-gray-600">{video.videoDuration || 'No duration'}</p>
                {video.videoDescription && (
                  <p className="text-sm text-gray-500 mt-1">{video.videoDescription}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openVideoModal(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVideo(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No videos yet. Click below to add one.</p>
      )}

      <button
        onClick={() => openVideoModal()}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Add Video
      </button>

      {showVideoModal && (
        <AddVideo
          closeVideoModal={closeVideoModal}
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
          editIndex={editIndex}
          currentModuleIndex={currentModuleIndex}
          chapterData={chapterData}
        />
      )}
    </div>
  );
};

VideoForm.propTypes = {
  currentModule: PropTypes.object.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
  currentModuleIndex: PropTypes.number,
  chapterData: PropTypes.object,
};

export default VideoForm;