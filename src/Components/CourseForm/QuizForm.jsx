import React from 'react'

const QuizForm = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Quizzes</h3>
      <p className="text-sm text-gray-500 mb-2">
        Add quizzes related to this module.
      </p>
      <button
        onClick={() => alert('Add Quiz modal here')}
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
      >
        Add Quiz
      </button>
    </div>
  )
}

export default QuizForm