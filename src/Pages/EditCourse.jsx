import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Clock, BookOpen, CheckSquare, AlertCircle, Image } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { apiService } from '../utils/apiHandler';
import { toast } from 'react-toastify';
import ThumbnailUploader from '../Components/ThumbnailUploader';
import VideoUploader from '../Components/VideoUploader';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { Token } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [courseData, setCourseData] = useState({
    courseName: '',
    heading: '',
    courseTopic: '',
    coursePrice: '',
    courseDescription: '',
    Features: {
      watchTime: '',
      chapters: '',
      quizes: ''
    }
  });

  useEffect(() => {
    const fetchCourseData = async () => {

      const response = await apiService({
        method: 'GET',
        endpoint: `/getCourse/${courseId}`,
        token: Token
      });

      setCourseData({
        courseName: response.courseName,
        heading: response.heading,
        courseTopic: response.courseTopic,
        coursePrice: response.coursePrice,
        courseDescription: response.courseDescription,
        Features: {
          watchTime: response.Features?.watchTime,
          chapters: response.Features?.chapters,
          quizes: response.Features?.quizes
        }
      });
      console.log(courseData);
      setIsLoading(false);
    };
    fetchCourseData();
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCourseData({
        ...courseData,
        [parent]: {
          ...courseData[parent],
          [child]: value
        }
      });
    } else {
      setCourseData({
        ...courseData,
        [name]: value
      });
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    // /api/uploadVideo this route will response videoID which we will store in courseThumbNail
    setIsLoadingVideo(true);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', videoFile.name);
    formData.append('collectionId', collectionID);
    console.log(formData);
    console.log(Token);
    const response = await apiService({
      method: 'POST',
      endpoint: '/uploadVideo',
      token: Token,
      data: formData
    });
    console.log(response);
    toast.success(response.message);
    setCourseData(preData => ({
      ...preData,
      introVideo: response.videoId, //need to check response first
    }));

    console.log(courseData.introVideo);
    setMessage({ text: 'Video upload succcessfully!', type: 'success' })
    setIsLoadingVideo(false);
  };

  const handleUploadThumbnail = async (e) => {
    e.preventDefault();
    // /api/upload-image this route will response imageID which we will store in courseThumbNail
    setIsLoadingImage(true);

    const formData = new FormData();
    formData.append('file', thumbnailFile);
    console.log(formData);

    console.log(Token);
    const response = await apiService({
      method: 'POST',
      endpoint: '/upload-image',
      token: Token,
      data: formData
    });
    console.log(response);
    toast.success(response.message);
    setCourseData(preData => ({
      ...preData,
      courseThumbNail: response.url, //need to check ImageID
    }));

    console.log(courseData.courseThumbNail);
    setMessage({ text: 'Thumbnail upload succcessfully!', type: 'success' })
    setIsLoadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    const response = await apiService({
      method: 'PUT',
      endpoint: `/updateCourse/${courseId}`,
      token: Token,
      data: courseData
    });
    toast.success(response.message);
    
    console.log('Course updated:', result);

    setTimeout(() => {
      navigate('/course');
    }, 2000);
    setIsSaving(false);

  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Course</h1>
          <button
            type="button"
            onClick={() => navigate(`/course/${courseId}/lecture`)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            Edit Chapters
          </button>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <p>{message.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange}
                placeholder="Enter course name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Heading</label>
              <input
                type="text"
                name="heading"
                value={courseData.heading}
                onChange={handleInputChange}
                placeholder="Enter course heading"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Topic</label>
              <input
                type="text"
                name="courseTopic"
                value={courseData.courseTopic}
                onChange={handleInputChange}
                placeholder="Enter course topic"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Price (₹)</label>
              <input
                type="text"
                name="coursePrice"
                value={courseData.coursePrice}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
              <textarea
                name="courseDescription"
                value={courseData.courseDescription}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Course Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline mr-1" size={16} />
                  Watch Time
                </label>
                <input
                  type="text"
                  name="Features.watchTime"
                  value={courseData.Features.watchTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 305 min"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="inline mr-1" size={16} />
                  Chapters
                </label>
                <input
                  type="text"
                  name="Features.chapters"
                  value={courseData.Features.chapters}
                  onChange={handleInputChange}
                  placeholder="e.g. 8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CheckSquare className="inline mr-1" size={16} />
                  Quizzes
                </label>
                <input
                  type="text"
                  name="Features.quizes"
                  value={courseData.Features.quizes}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Course Thumbnail</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreviewUrl ? (
                  <div className="w-full">
                    <img
                      src={imagePreviewUrl}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {thumbnailFile ? thumbnailFile.name : 'Current thumbnail'}
                      </span>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => thumbnailInputRef.current.click()}
                      >
                        Change image
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current.click()}
                    className="flex flex-col items-center justify-center py-8 w-full"
                  >
                    <Image size={40} className="text-gray-400 mb-2" />
                    <p className="text-gray-700 font-medium">Click to upload thumbnail</p>
                    <p className="text-gray-500 text-sm mt-1">JPG, PNG, or WebP</p>
                  </button>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Intro Video</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  accept="video/*"
                  className="hidden"
                />

                {videoPreviewUrl ? (
                  <div className="w-full">
                    <video
                      controls
                      src={videoPreviewUrl}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {videoFile ? videoFile.name : 'Current video'}
                      </span>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => videoInputRef.current.click()}
                      >
                        Change video
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoInputRef.current.click()}
                    className="flex flex-col items-center justify-center py-8 w-full"
                  >
                    <Upload size={40} className="text-gray-400 mb-2" />
                    <p className="text-gray-700 font-medium">Click to upload intro video</p>
                    <p className="text-gray-500 text-sm mt-1">recommended .mp4</p>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/course')}
              className="w-full py-3 px-4 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200`}
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;