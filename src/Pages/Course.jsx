import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const courseData = [
  {
    "id":"1",
    "courseName": "React Basics",
    "heading": "Learn React from Scratch",
    "courseTopic": "React.js",
    "courseThumbNail": "https://img.freepik.com/free-vector/react-native-programming-banner_23-2149232302.jpg",
    "coursePrice": "4999",
    "introVideo": "https://iframe.mediadelivery.net/play/411923/sample1",
    "courseDiscription": "A beginner-friendly React course covering components, props, and hooks.",
    "rating": 4.7,
    "Features": {
      "warchtime": "320 min",
      "chapters": "8",
      "quizes": "4"
    }
  },
  {
    "id":"2",
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
    "id":"3",
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
    "id":"4",
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
    "id":"5",
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
const Course = () => {
  const [courses, setCourses] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // const fetchCourses = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3000/api/getCourses');

    //     if (!response.ok) {
    //       throw new Error(`Error fetching courses: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     setCourses(data);
    //     setLoading(false);
    //   } catch (err) {
    //     setError(err.message);
    //     setLoading(false);
    //   }
    // };

    // fetchCourses();
    setCourses(courseData);
  }, []);

  const handleEdit = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        console.log(`Deleting course with ID: ${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (err) {
        console.error("Failed to delete course:", err);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    // try {
    //   const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    //   console.log(`Changing course ${courseId} status to ${newStatus}`);
    //   // Example API call:
    //   // await fetch(`http://localhost:3000/api/updateCourseStatus/${courseId}`, {
    //   //   method: 'PUT',
    //   //   headers: { 'Content-Type': 'application/json' },
    //   //   body: JSON.stringify({ status: newStatus })
    //   // });

    //   // Update state locally
    //   setCourses(courses.map(course =>
    //     course.id === courseId ? { ...course, status: newStatus } : course
    //   ));
    // } catch (err) {
    //   console.error("Failed to update course status:", err);
    //   alert("Failed to update course status. Please try again.");
    // }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-xl font-semibold">Loading courses...</div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-xl font-semibold text-red-600">
  //         Error: {error}. Please try again later.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen px-6 py-6 w-auto">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Course Management</h1>
          <Link
            to={"/CreateCourse"}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-4 px-6 text-left font-medium text-black">Title</th>
                <th className="py-4 px-6 text-right font-medium text-black">Price</th>
                <th className="py-4 px-6 text-center font-medium text-black">Status</th>
                <th className="py-4 px-6 text-right font-medium text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id || index}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="py-4 px-6 text-left">{course.courseName}</td>
                  <td className="py-4 px-6 text-right">{course.coursePrice}₹</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleTogglePublish(course.id || index, course.status || 'Draft')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${(course.status || 'Draft') === 'Published'
                            ? 'bg-green-500 text-green-900'
                            : 'bg-yellow-500 text-yellow-900'
                          }`}
                      >
                        {course.status || 'Draft'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(course.id || index)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id || index)}
                        className="bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-md hidden md:block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          A list of your recent courses.
        </div>
      </div>
    </div>
  );
};

export default Course;