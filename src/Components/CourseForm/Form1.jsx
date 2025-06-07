import PropTypes from 'prop-types';
import { Clock, BookOpen, CheckSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { apiService } from '../../utils/apiHandler';
import ThumbnailUploader from '../ThumbnailUploader';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Form1 = ({ formType, handleSubmit, courseData, setCourseData, message, setMessage, courseId }) => {

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const thumbnailInputRef = useRef(null);
  const { Token } = useAuth();

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

  useEffect(() => {
    if (courseData.courseThumbNail) {
      setImagePreviewUrl(courseData.courseThumbNail);
    }
  }, [courseData]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    }
  };

  const handleUploadThumbnail = async (e) => {
    e.preventDefault();
    setIsLoadingImage(true);

    const formData = new FormData();
    formData.append('file', thumbnailFile);

    const response = await apiService({
      method: 'POST',
      endpoint: '/upload-image',
      token: Token,
      data: formData
    });

    const updatedCourseData = {
      ...courseData,
      courseThumbNail: response.url,
    };
    setCourseData(updatedCourseData);

    console.log('Thumbnail uploaded successfully:', updatedCourseData);

    await apiService({
      method: 'PUT',
      endpoint: `/updateCourse/${courseId}`,
      token: Token,
      data: updatedCourseData,
    });
    setMessage({ text: 'Thumbnail upload succcessfully!', type: 'success' })
    setIsLoadingImage(false);
  };

  return (
    <div className="mx-auto p-10 w-full mt-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{formType} Course</h1>
        {formType === 'Edit' && (
          <Link to={`/course/${courseId}/modules`} className="text-sm text-blue-500 hover:underline mb-4">
            <span className="font-semibold text-lg">Edit Lectures</span>
          </Link>
        )}

      </div>
      {message?.text && (
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
        </div>
        <div className='mt-6'>
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

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Course Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor='watchTime' className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline mr-1" size={16} />
                Videos
              </label>
              <input
                type="text"
                id='watchTime'
                name="Features.watchTime"
                value={courseData.Features.watchTime}
                onChange={handleInputChange}
                placeholder="e.g. 42"
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
        {formType === 'Edit' && (
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
        )}

        <div className="w-full mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {formType} Course
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form1;

Form1.propTypes = {
  formType: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  courseData: PropTypes.object.isRequired,
  setCourseData: PropTypes.func.isRequired,
  message: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  setMessage: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired
};