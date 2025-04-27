import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../utils/apiHandler';
import { useAuth } from '../Context/AuthContext';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { Token } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      const response = await apiService({
        method: 'GET',
        endpoint: `/getCourses/1`,
      })
      console.log(response);
      setCourses(response.data);

      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleEdit = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        console.log(`Deleting course with ID: ${courseId}`);
        // api route to delete cousreapi/deleteCourse/:courseID
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading courses...</div>
      </div>
    );
  }

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
    <div className="w-full mx-10 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Link
          to={"/course/create"}
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
                key={course._id}
                className="border-b border-gray-800 hover:bg-gray-300 rounded-6xl"
              >
                <td className="py-4 px-6 text-left">{course.courseName}</td>
                <td className="py-4 px-6 text-right">{course.coursePrice}₹</td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${(course.status) === 'Published'
                        ? 'bg-green-500 text-green-900'
                        : 'bg-yellow-500 text-yellow-900'
                        }`}
                    >
                      {course.status}
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
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
  );
};

export default Course;