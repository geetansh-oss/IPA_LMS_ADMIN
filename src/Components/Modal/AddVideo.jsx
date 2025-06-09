import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { uploadVideo, cleanObject } from '../../services/chapterServices';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../utils/apiHandler';
import { useAuth } from '../../Context/AuthContext';
import { useParams } from 'react-router-dom';
import { useCourse } from '../../Context/CourseContext';
import { toast } from 'react-toastify';

const AddVideo = ({ closeVideoModal, currentModule, setCurrentModule, editIndex, currentModuleIndex, chapterData }) => {
  const { Token } = useAuth();
  const { courseId } = useParams();
  const { updateChapter } = useCourse();

  console.log( "currentModule" , currentModule);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (editIndex !== null && currentModule.Videos?.[editIndex]) {
      const video = currentModule.Videos[editIndex];
      setVideoTitle(video.videoName || '');
      setVideoDuration(video.videoDuration || '');
      setVideoDescription(video.videoDescription || '');
    }
  }, [editIndex, currentModule]);

  const { data: courseData } = useQuery({
    queryKey: ['courseData', courseId],
    queryFn: async () =>
      await apiService({
        method: 'GET',
        endpoint: `/getCourse/${courseId}`,
        token: Token,
      }),
    enabled: !!courseId && !!Token,
  });

  const CollectionId = courseData?.bunnyCollectionId;

  const addOrUpdateVideo = async () => {
    if (!videoTitle) {
      alert('Please provide a video title.');
      return;
    }
    // If adding new video, file is required
    if (editIndex === null && !videoFile) {
      alert('Please select a video file.');
      return;
    }
    setUploading(true);
    try {
      let videoId = null;
      // Upload video if file is provided
      if (videoFile) {
        videoId = await uploadVideo(videoFile, CollectionId, Token);
        if (!videoId) {
          throw new Error('Video upload failed - no video ID returned');
        }
      }
      // Create video data object
      const videoData = {
        videoId: videoId || (editIndex !== null ? currentModule.Videos[editIndex].videoId : null),
        videoName: videoTitle,
        videoDescription: videoDescription,
        videoDuration: videoDuration,
      };
      // Update the Videos array
      const updatedVideos = [...(currentModule?.Videos || [])];
      if (editIndex !== null) {
        // Update existing video
        updatedVideos[editIndex] = videoData;
      } else {
        // Add new video
        updatedVideos.push(videoData);
      }
      // Prepare the updated chapter data for database
      const updatedChapter = {
        ...currentModule,
        CourseId: courseId,
        Videos: updatedVideos.map(video => cleanObject(video)),
      };
      // Clean the chapter object
      const cleanedChapter = cleanObject(updatedChapter);
      console.log('Updating chapter with:', cleanedChapter);
      // Update in database
      await updateChapter.mutateAsync({
        chapterId: currentModule._id,
        updatedChapter: cleanedChapter,
        token: Token,
      });
      // Update local state
      setCurrentModule(prev => ({
        ...prev,
        Videos: updatedVideos,
      }));
      toast.success(`Video ${editIndex !== null ? 'updated' : 'added'} successfully!`);
      closeVideoModal();
    } catch (error) {
      console.error('Video operation failed:', error);
      toast.error(`Video operation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // Button text logic
  let buttonText = 'Add Video';
  if (uploading) {
    buttonText = 'Uploading...';
  } else if (editIndex !== null) {
    buttonText = 'Update Video';
  }

  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-md shadow-lg z-50 relative">
        <h2 className="text-xl font-semibold mb-4">
          {editIndex !== null ? 'Edit Video' : 'Add Video'}
        </h2>

        <div className="mb-4">
          <label htmlFor="video-title" className="block text-sm font-medium mb-1">Video Title *</label>
          <input
            id="video-title"
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter video title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="video-duration" className="block text-sm font-medium mb-1">Duration</label>
          <input
            id="video-duration"
            type="text"
            value={videoDuration}
            onChange={(e) => setVideoDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g., 5 min"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="video-description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="video-description"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter video description"
            rows="3"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Video File {editIndex === null && '*'}
          </label>
          <label className="block w-full cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200 transition-all">
            <input
              type="file"
              accept=".mp4,.mkv"
              onChange={(e) => {
                const file = e.target.files[0];
                setVideoFile(file);
                setFileName(file?.name || '');
              }}
              className="hidden"
            />
            {fileName ? `📁 ${fileName}` : 'Click to select a video file'}
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: MP4, MKV. {editIndex !== null && 'Leave empty to keep existing video.'}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeVideoModal}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={addOrUpdateVideo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={uploading}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

AddVideo.propTypes = {
  closeVideoModal: PropTypes.func.isRequired,
  currentModule: PropTypes.object.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
  editIndex: PropTypes.number,
  currentModuleIndex: PropTypes.number,
  chapterData: PropTypes.object,
};

export default AddVideo;