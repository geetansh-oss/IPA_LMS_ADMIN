import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../utils/apiHandler';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { Token } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: 'GET',
          endpoint: `/getCourses/1`,
          token: Token
        });
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        toast.error('Failed to fetch courses');
      }
      setLoading(false);
    };
    fetchCourses();
  }, [Token]);

  const handleEdit = (courseId) => navigate(`/course/${courseId}`);

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await apiService({
          method: 'DELETE',
          endpoint: `/deleteCourse/${courseId}`,
          token: Token,
        });
        if (response.status === 204) {
          setCourses(prev => prev.filter(course => course._id !== courseId));
          toast.success("Course deleted successfully.");
        } else {
          toast.error("Failed to delete course.");
        }
      } catch (err) {
        console.error("Error deleting course:", err);
        toast.error("Error deleting course.");
      }
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      const response = await apiService({
        method: 'PUT',
        endpoint: `/updateCourseStatus/${courseId}`,
        token: Token,
        body: { status: newStatus }
      });

      if (response.success) {
        setCourses(prev =>
          prev.map(c => c._id === courseId ? { ...c, status: newStatus } : c)
        );
        toast.success(`Status changed to ${newStatus}`);
      } else {
        toast.error("Failed to update course status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
        <div className="text-xl font-semibold">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 pt-10 pb-20 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Link
          to={"/course/create"}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-900">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-4 px-6 text-left font-medium text-gray-300">Title</th>
              <th className="py-4 px-6 text-right font-medium text-gray-300">Price</th>
              <th className="py-4 px-6 text-center font-medium text-gray-300">Status</th>
              <th className="py-4 px-6 text-right font-medium text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-b bg-gray-800 border-gray-700 hover:bg-gray-700 transition"
              >
                <td className="py-4 px-6">{course.courseName}</td>
                <td className="py-4 px-6 text-right">{course.coursePrice}₹</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleTogglePublish(course._id, course.status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      course.status === 'Published'
                        ? 'bg-green-500 text-white hover:bg-green-400'
                        : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }`}
                  >
                    {course.status}
                  </button>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md transition"
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

      <p className="mt-6 text-center text-gray-400 text-sm">
        A list of your recent courses.
      </p>
    </div>
  );
};

export default Course;
