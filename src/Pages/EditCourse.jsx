import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { apiService } from '../utils/apiHandler';
import Form1 from '../Components/CourseForm/Form1';
import { useQuery } from '@tanstack/react-query';

const EditCourse = () => {
  const { courseId } = useParams();
  const { Token } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [courseData, setCourseData] = useState({
    status: 'draft',
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

  const { data, isLoading } = useQuery({
    queryKey: ['courseData', courseId],
    queryFn: async () => {
      const response = await apiService({
        method: 'GET',
        endpoint: `/getCourse/${courseId}`,
        token: Token
      });
      return response;
    },
    enabled: !!courseId
  });

  // Populate courseData when data is fetched
  useEffect(() => {
    if (data) {
      setCourseData({
        ...courseData,
        courseName: data.courseName || '',
        heading: data.heading || '',
        courseTopic: data.courseTopic || '',
        coursePrice: data.coursePrice || '',
        courseDescription: data.courseDescription || '',
        courseThumbNail: data.courseThumbNail || '',
        Features: {
          watchTime: data.Features?.watchTime || '',
          chapters: data.Features?.chapters || '',
          quizes: data.Features?.quizes || ''
        }
      });
      console.log('Course data fetched successfully:', data);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsSubmitting(true);

    const payload = {
      ...courseData
    };
    if(!payload.courseThumbNail){
      delete payload.courseThumbNail;
    }

    const response = await apiService({
      method: 'PUT',
      endpoint: `/updateCourse/${courseId}`,
      token: Token,
      data: payload
    });
    setMessage({ text: response.message, type: 'success' });
    setIsSubmitting(false);
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
  }

  return (
    <div>
      <Form1
        formType={"Edit"}
        handleSubmit={handleSubmit}
        courseData={courseData}
        setCourseData={setCourseData}
        message={message}
        setMessage={setMessage}
        courseId={courseId}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default EditCourse