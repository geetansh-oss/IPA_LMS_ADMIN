import React, { useState, useRef } from 'react';
import { Upload, Clock, BookOpen, CheckSquare, AlertCircle, Image } from 'lucide-react';

export default function CreateCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  
  const [courseData, setCourseData] = useState({
    courseName: null,
    heading: null,
    courseTopic: null,
    coursePrice: null,
    courseDiscription: null,
    Features: {
      watchtime: null,
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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Create a preview URL for the video
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    if (!videoFile) {
      setMessage({ text: 'Please upload an intro video', type: 'error' });
      setIsLoading(false);
      return;
    }

    if (!thumbnailFile) {
      setMessage({ text: 'Please upload a course thumbnail', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add the video file
      formData.append('introVideo', videoFile);
      
      // Add the thumbnail image
      formData.append('courseThumbNail', thumbnailFile);
      
      // Add the course data as JSON
      formData.append('courseData', JSON.stringify(courseData));

      // Send data to the backend
      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const result = await response.json();
      setMessage({ text: 'Course created successfully!', type: 'success' });
      console.log('Course created:', result);
      
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
              <input
                type="textarea"
                name="courseDiscription"
                value={courseData.courseDiscription}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline mr-1" size={16} />
                  Watch Time
                </label>
                <input
                  type="text"
                  name="Features.watchtime"
                  value={courseData.Features.watchtime}
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
                      <span className="text-sm text-gray-600">{thumbnailFile.name}</span>
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
                      <span className="text-sm text-gray-600">{videoFile.name}</span>
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

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200`}
            >
              {isLoading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}