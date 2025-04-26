import React, { useState, useRef } from 'react';
import { Clock, BookOpen, CheckSquare, AlertCircle } from 'lucide-react';
import { apiService } from '../utils/apiHandler';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import ThumbnailUploader from '../Components/ThumbnailUploader';
import VideoUploader from '../Components/VideoUploader';

export default function CreateCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const { Token } = useAuth();
  const collectionID = import.meta.env.VITE_INTRO_COLLECTION_ID;


  const [courseData, setCourseData] = useState({
    status: "draft",
    courseName: null,
    heading: null,
    courseTopic: null,
    coursePrice: null,
    courseDescription: null,
    courseThumbNail: null,
    introVideo: null,
    Features: {
      watchTime: null,
      chapters: null,
      quizes: null
    }
  });

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    }
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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Create a preview URL for the video
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    console.log(courseData);
    const response = await apiService({
      method: 'POST',
      endpoint: '/addCourse',
      token: Token,
      data: courseData
    });
    toast.success(response.message);

    setMessage({ text: 'Course created successfully!', type: 'success' }); 
    setIsLoading(false);
  };

  return (
    <div className="mx-auto p-10 w-full mt-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h1>

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
            <label htmlFor='courseName' className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              id='courseName'
              name="courseName"
              value={courseData.courseName}
              onChange={handleInputChange}
              placeholder="Enter course name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor='heading' className="block text-sm font-medium text-gray-700 mb-1">Course Heading</label>
            <input
              type="text"
              id='heading'
              name="heading"
              value={courseData.heading}
              onChange={handleInputChange}
              placeholder="Enter course heading"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor='courseTopic' className="block text-sm font-medium text-gray-700 mb-1">Course Topic</label>
            <input
              type="text"
              id='courseTopic'
              name="courseTopic"
              value={courseData.courseTopic}
              onChange={handleInputChange}
              placeholder="Enter course topic"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor='coursePrice' className="block text-sm font-medium text-gray-700 mb-1">Course Price (₹)</label>
            <input
              type="number"
              id='coursePrice'
              name="coursePrice"
              value={courseData.coursePrice}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor='courseDescription' className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
            <textarea
              type="textarea"
              id='courseDescription'
              name="courseDescription"
              value={courseData.courseDescription}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Course Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor='watchTime' className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline mr-1" size={16} />
                Watch Time
              </label>
              <input
                type="text"
                id='watchTime'
                name="Features.watchTime"
                value={courseData.Features.watchTime}
                onChange={handleInputChange}
                placeholder="e.g. 305 min"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor='chapters' className="block text-sm font-medium text-gray-700 mb-1">
                <BookOpen className="inline mr-1" size={16} />
                Chapters
              </label>
              <input
                type="text"
                id='chapters'
                name="Features.chapters"
                value={courseData.Features.chapters}
                onChange={handleInputChange}
                placeholder="e.g. 8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor='quizes' className="block text-sm font-medium text-gray-700 mb-1">
                <CheckSquare className="inline mr-1" size={16} />
                Quizes
              </label>
              <input
                type="text"
                id='quizes'
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

        <div className="mt-6 grid grid-cols-1 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Course Thumbnail</h2>
            <ThumbnailUploader
              imagePreviewUrl={imagePreviewUrl}
              thumbnailFile={thumbnailFile}
              isLoading={isLoadingImage}
              thumbnailInputRef={thumbnailInputRef}
              handleThumbnailChange={handleThumbnailChange}
              handleUploadThumbnail={handleUploadThumbnail}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Intro Video</h2>
            <VideoUploader
              videoPreviewUrl={videoPreviewUrl}
              videoFile={videoFile}
              isLoading={isLoadingVideo}
              videoInputRef={videoInputRef}
              handleVideoChange={handleVideoChange}
              handleUploadVideo={handleUploadVideo}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            // disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200`}
          >
            {isLoading ? 'Creating Course...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}