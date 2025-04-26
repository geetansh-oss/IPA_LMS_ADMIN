import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Clock, BookOpen, CheckSquare, AlertCircle, Image } from 'lucide-react';

const coursedata = [
  {
    "id": "1",
    "courseName": "React Basics",
    "heading": "Learn React from Scratch",
    "courseTopic": "React.js",
    "coursePrice": "4999",
    "courseDescription": "A beginner-friendly React course covering components, props, and hooks.",
    "courseThumbNail": "https://img.freepik.com/free-vector/react-native-programming-banner_23-2149232302.jpg",
    "introVideo": "https://iframe.mediadelivery.net/play/411923/sample1",
    "rating": 4.7,
    "Features": {
      "warchtime": "320 min",
      "chapters": "8",
      "quizes": "4"
    }
  },
  {
    "id": "2",
    "courseName": "Node Mastery",
    "heading": "Backend Development with Node.js",
    "courseTopic": "Node.js",
    "courseThumbNail": "https://img.freepik.com/free-vector/gradient-backend-developer-illustration_23-2149284016.jpg",
    "coursePrice": "5999",
    "introVideo": "https://iframe.mediadelivery.net/play/411923/sample2",
    "courseDiscription": "Master Node.js with Express, MongoDB, and REST APIs.",
    "rating": 4.6,
    "Features": {
      "warchtime": "450 min",
      "chapters": "10",
      "quizes": "5"
    }
  },
  {
    "id": "3",
    "courseName": "UI/UX Bootcamp",
    "heading": "Design Thinking and UI Tools",
    "courseTopic": "Design",
    "courseThumbNail": "https://img.freepik.com/free-vector/flat-illustration-ux-ui-design_23-2149373027.jpg",
    "coursePrice": "3999",
    "introVideo": "https://iframe.mediadelivery.net/play/411923/sample3",
    "courseDiscription": "Learn how to design beautiful and usable interfaces.",
    "rating": 4.4,
    "Features": {
      "warchtime": "280 min",
      "chapters": "7",
      "quizes": "3"
    }
  },
  {
    "id": "4",
    "courseName": "JavaScript Deep Dive",
    "heading": "Advanced JavaScript Concepts",
    "courseTopic": "JavaScript",
    "courseThumbNail": "https://img.freepik.com/free-vector/javascript-abstract-concept_335657-3706.jpg",
    "coursePrice": "5499",
    "introVideo": "https://iframe.mediadelivery.net/play/411923/sample4",
    "courseDiscription": "Understand closures, scopes, hoisting, async/await, and more.",
    "rating": 4.8,
    "Features": {
      "warchtime": "360 min",
      "chapters": "9",
      "quizes": "6"
    }
  },
  {
    "id": "5",
    "courseName": "Fullstack Project Lab",
    "heading": "Build Real-World Projects",
    "courseTopic": "Fullstack",
    "courseThumbNail": "https://img.freepik.com/free-vector/software-engineer-concept_23-2148685403.jpg",
    "coursePrice": "6999",
    "introVideo": "https://iframe.mediadelivery.net/play/411923/sample5",
    "courseDiscription": "Use MERN stack to build complete apps with deployment.",
    "rating": 4.9,
    "Features": {
      "warchtime": "600 min",
      "chapters": "12",
      "quizes": "8"
    }
  }
]
const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

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
    courseDiscription: '',
    Features: {
      watchtime: '',
      chapters: '',
      quizes: ''
    }
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // const response = await fetch(`/api/getCourse/${courseId}`);

        // if (!response.ok) {
        //   throw new Error('Failed to fetch course data');
        // }

        // const data = await response.json();
        const data = coursedata[courseId - 1];
        console.log(data);

        // Populate the form with existing data
        setCourseData({
          courseName: data.courseName || '',
          heading: data.heading || '',
          courseTopic: data.courseTopic || '',
          coursePrice: data.coursePrice || '',
          courseDiscription: data.courseDiscription || '',
          Features: {
            watchtime: data.Features?.watchtime || '',
            chapters: data.Features?.chapters || '',
            quizes: data.Features?.quizes || ''
          }
        });

        setIsLoading(false);
      } catch (error) {
        setMessage({ text: `Error: ${error.message}`, type: 'error' });
        setIsLoading(false);
        console.error('Error fetching course:', error);
      }
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
      setThumbnailFile(file); e
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();

      if (videoFile) {
        formData.append('introVideo', videoFile);
      }
      if (thumbnailFile) {
        formData.append('courseThumbNail', thumbnailFile);
      }
      formData.append('courseData', JSON.stringify(courseData));

      const response = await fetch(`/api/course/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const result = await response.json();
      setMessage({ text: 'Course updated successfully!', type: 'success' });
      console.log('Course updated:', result);

      setTimeout(() => {
        navigate('/course');
      }, 2000);

    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
      console.error('Error updating course:', error);
    } finally {
      setIsSaving(false);
    }
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
                name="courseDiscription"
                value={courseData.courseDiscription}
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