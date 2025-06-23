import { useEffect, useState } from 'react';
import PropType from 'prop-types';
import { useCourse } from '../../Context/CourseContext';
import { useAuth } from '../../Context/AuthContext';
import { cleanObject } from '../../services/chapterServices';

const AddQuiz = ({ closeQuizModal, currentModule, setCurrentModule, editIndex }) => {
  const [quizName, setQuizName] = useState('');
  const [quizLink, setQuizLink] = useState('');

  const { updateChapter } = useCourse();
  const { Token } = useAuth();
  const chapterId = currentModule._id;

  useEffect(() => {
    if (editIndex !== null && currentModule.quizes?.[editIndex]) {
      const quiz = currentModule.quizes[editIndex];
      setQuizName(quiz.quizName || '');
      setQuizLink(quiz.quizLink || '');
    }
  }, [editIndex, currentModule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quizName || !quizLink) {
      alert('Please fill in all fields.');
      return;
    }

    const updatedQuizes = [...(currentModule.quizes || [])];

    if (editIndex !== null) {
      updatedQuizes[editIndex] = { quizName, quizLink };
    } else {
      updatedQuizes.push({ quizName, quizLink });
    }

    const updatedChapter = {
      ...currentModule,
      quizes: updatedQuizes,
    };

    updateChapter.mutateAsync({
      chapterId,
      updatedChapter: cleanObject(updatedChapter),
      token: Token,
    })
      .then(() => {
        console.log('Quiz updated successfully');
      })
      .catch((error) => {
        console.error('Error updating quiz:', error);
        alert('Failed to update quiz. Please try again.');
      });

    setCurrentModule((prev) => ({
      ...prev,
      quizes: updatedQuizes,
    }));

    closeQuizModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#1f1f1f] rounded-lg shadow-2xl p-6 w-full max-w-md text-white">
        <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Quiz' : 'Add Quiz'}</h2>

        <div className="mb-4">
          <label htmlFor="quiz-title" className="block text-sm font-medium mb-1 text-gray-300">Quiz Title</label>
          <input
            id="quiz-title"
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full border border-gray-600 bg-[#2b2b2b] text-white rounded px-3 py-2 placeholder-gray-400"
            placeholder="Enter quiz title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quiz-url" className="block text-sm font-medium mb-1 text-gray-300">Quiz URL</label>
          <input
            id="quiz-url"
            type="url"
            value={quizLink}
            onChange={(e) => setQuizLink(e.target.value)}
            className="w-full border border-gray-600 bg-[#2b2b2b] text-white rounded px-3 py-2 placeholder-gray-400"
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeQuizModal}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editIndex !== null ? 'Update Quiz' : 'Add Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

AddQuiz.propTypes = {
  closeQuizModal: PropType.func.isRequired,
  currentModule: PropType.object.isRequired,
  setCurrentModule: PropType.func.isRequired,
  editIndex: PropType.number,
};

export default AddQuiz;
