import PropTypes from 'prop-types';
import { useState } from 'react';
import AddQuiz from '../Modal/AddQuiz';

const QuizForm = ({ currentModule, setCurrentModule }) => {

  const [openModel, setOpenModel] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openQuizModal = (index = null) => {
    setEditIndex(index);
    setOpenModel(true);
  };

  const closeQuizModal = () => {
    setOpenModel(false);
    setEditIndex(null);
  };

  const deleteQuiz = (index) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      const updatedQuizzes = currentModule.quizes.filter((_, i) => i !== index);
      setCurrentModule(prev => ({
        ...prev,
        quizes: updatedQuizzes
      }));
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Quizzes</h3>
      {currentModule?.quizes?.length > 0 ? (
        <div className="space-y-2 mb-4">
          {currentModule.quizes.map((quiz, index) => (
            <div
              key={quiz.quizId || quiz.quizName || index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded border"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{quiz.quizName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openQuizModal(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuiz(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No quizzes added yet.</p>
      )}

      <button
        onClick={() => openQuizModal()}
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
      >
        Add Quiz
      </button>

      {openModel && (
        <AddQuiz
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
          closeQuizModal={closeQuizModal}
          editIndex={editIndex}
        />
      )}
    </div>
  )
}

QuizForm.propTypes = {
  currentModule: PropTypes.object.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
};

export default QuizForm;