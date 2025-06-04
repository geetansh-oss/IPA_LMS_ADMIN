import { useState } from 'react'
import Form1 from '../Components/CourseForm/Form1'
import { useAuth } from '../Context/AuthContext'
import { apiService } from '../utils/apiHandler'

const Form = () => {

  const { Token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [courseData, setCourseData] = useState({
    status: "draft",
    courseName: "",
    heading: "",
    courseTopic: "",
    coursePrice: "",
    courseDescription: "",
    Features: {
      watchTime: "",
      chapters: "",
      quizes: ""
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const response = await apiService({
      method: 'POST',
      endpoint: '/addCourse',
      token: Token,
      data: courseData
    });
    
    if(response.ok){
      setMessage({ text: response.message, type: 'success' });
    }
    setIsLoading(false);
    setCourseData({
      courseName: "",
      heading: "",
      courseTopic: "",
      coursePrice: "",
      courseDescription: "",
      Features: {
        watchTime: "",
        chapters: "",
        quizes: ""
      }
    });
  }

  return (
    <div>
      <Form1
        formType={"Create"}
        handleSubmit={handleSubmit}
        courseData={courseData}
        setCourseData={setCourseData}
        message={message}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Form;
