import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { uploadVideo, cleanObject } from '../../services/chapterServices';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../utils/apiHandler';
import { useAuth } from '../../Context/AuthContext';
import { useParams } from 'react-router-dom';
import { useCourse } from '../../Context/CourseContext';
import { toast } from 'react-toastify';

const AddVideo = ({ closeVideoModal, currentModule, setCurrentModule, editIndex }) => {
  const { Token } = useAuth();
  const { courseId } = useParams();
  const { updateChapter } = useCourse();

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (editIndex !== null && currentModule.Videos?.[editIndex]) {
      const video = currentModule.Videos[editIndex];
      setVideoTitle(video.videoName);
      setVideoDuration(video.videoDuration);
      setVideoDescription(video.videoDescription);
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

    if (editIndex === null && !videoFile) {
      alert('Please select a video file.');
      return;
    }

    setUploading(true);
    try {
      let videoId = null;
      if (videoFile) {
        videoId = await uploadVideo(videoFile, CollectionId, Token);
        if (!videoId) throw new Error('Video upload failed');
      }

      const videoData = {
        videoId: videoId || (editIndex !== null ? currentModule.Videos[editIndex].videoId : null),
        videoName: videoTitle,
        videoDescription,
        videoDuration,
      };

      const updatedVideos = [...(currentModule?.Videos || [])];
      if (editIndex !== null) {
        updatedVideos[editIndex] = videoData;
      } else {
        updatedVideos.push(videoData);
      }

      const updatedChapter = {
        ...currentModule,
        CourseId: courseId,
        Videos: updatedVideos.map(video => cleanObject(video)),
      };

      await updateChapter.mutateAsync({
        chapterId: currentModule._id,
        updatedChapter: cleanObject(updatedChapter),
        token: Token,
      });

      setCurrentModule(prev => ({
        ...prev,
        Videos: updatedVideos,
      }));

      toast.success(`Video ${editIndex !== null ? 'updated' : 'added'} successfully!`);
      closeVideoModal();
    } catch (error) {
      toast.error(`Video operation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  let buttonText = 'Add Video';
  if (uploading) buttonText = 'Uploading...';
  else if (editIndex !== null) buttonText = 'Update Video';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#1f1f1f] text-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editIndex !== null ? 'Edit Video' : 'Add Video'}
        </h2>

        <div className="mb-4">
          <label htmlFor="video-title" className="block text-sm font-medium mb-1 text-gray-300">Video Title *</label>
          <input
            id="video-title"
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="w-full border border-gray-600 bg-[#2b2b2b] text-white rounded px-3 py-2 placeholder-gray-400"
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="video-duration" className="block text-sm font-medium mb-1 text-gray-300">Duration</label>
          <input
            id="video-duration"
            type="text"
            value={videoDuration}
            onChange={(e) => setVideoDuration(e.target.value)}
            className="w-full border border-gray-600 bg-[#2b2b2b] text-white rounded px-3 py-2 placeholder-gray-400"
            placeholder="e.g., 5 min"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="video-description" className="block text-sm font-medium mb-1 text-gray-300">Description</label>
          <textarea
            id="video-description"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="w-full border border-gray-600 bg-[#2b2b2b] text-white rounded px-3 py-2 placeholder-gray-400"
            rows="3"
            placeholder="Enter video description"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Video File {editIndex === null && '*'}
          </label>
          <label className="block w-full cursor-pointer bg-[#2b2b2b] border border-gray-600 rounded-lg px-4 py-2 hover:bg-[#383838] transition-all">
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
          <p className="text-sm text-gray-400 mt-1">
            Supported formats: MP4, MKV. {editIndex !== null && 'Leave empty to keep existing video.'}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeVideoModal}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={addOrUpdateVideo}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
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
};

export default AddVideo;
