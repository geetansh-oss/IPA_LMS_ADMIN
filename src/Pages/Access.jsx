import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiService } from '../utils/apiHandler'
import { toast } from 'react-toastify'
import { useAuth } from '../Context/AuthContext'

const Access = () => {
  const [data, setData] = useState({
    userId: '',
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
    onSuccess: () => {
      toast.success('Access granted successfully!')
      setData({ userId: '', courseId: '' })
    },
    onError: () => {
      toast.error('Failed to give access.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!data.userId || !data.courseId) {
      toast.warn('Please fill out all fields')
      return
    }
    mutation.mutate()
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Give Access</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Select a course and enter the user ID to give access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor='user' className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              id='user'
              required
              placeholder="Enter User ID"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={data.userId}
              onChange={(e) => setData((prev) => ({ ...prev, userId: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor='course' className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
            <select
              required
              id='course'
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

export default Access
