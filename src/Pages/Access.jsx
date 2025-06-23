import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiService } from '../utils/apiHandler'
import { toast } from 'react-toastify'
import { useAuth } from '../Context/AuthContext'

const Access = () => {
  const [data, setData] = useState({
    email: '',
    courseId: '',
  })
  const { Token } = useAuth()

  // Fetch courses
  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiService({ method: 'GET', endpoint: '/getCourses/1' }),
  })

  const coursesData = courses?.data || []

  // Submit mutation
  const mutation = useMutation({
    mutationFn: () =>
      apiService({
        method: 'POST',
        endpoint: '/giveAccess',
        token: Token,
        data,
      }),
    onSuccess: (data) => {
      toast.success(data.message || 'Access granted successfully!')
      setData({ email: '', courseId: '' })
    },
    onError: () => {
      toast.error('Failed to give access.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!data.email || !data.courseId) {
      toast.warn('Please fill out all fields')
      return
    }
    mutation.mutate()
  }

  return (
    <div className="flex items-center justify-center h-full overflow-y-auto">
      <div className="w-full flex flex-col gap-4 max-w-md bg-gray-800 shadow-lg rounded-2xl p-8 my-8">
        <h1 className="text-3xl font-bold text-center mb-2">Give Access</h1>
        <p className="text-sm text-center mb-6">
          Select a course and enter the email to give access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor='user' className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id='user'
              required
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={data.email}
              onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor='course' className="block text-sm font-medium mb-1">Select Course</label>
            <select
              required
              id='course'
              className="w-full px-4 py-2 border bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={data.courseId}
              onChange={(e) => setData((prev) => ({ ...prev, courseId: e.target.value }))}
              disabled={isLoading}
            >
              <option value="" disabled>Select a course</option>
              {coursesData.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
            {isError && <p className="text-red-500 text-sm mt-1">Failed to load courses.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Giving Access...' : 'Give Access'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Access;
