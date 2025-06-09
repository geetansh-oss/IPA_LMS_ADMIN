import PropTypes from 'prop-types';
import VideoForm from './VideoForm';
import QuizForm from './QuizForm';
import { useCourse } from '../../Context/CourseContext';
import { cleanObject } from '../../services/chapterServices';
import { useAuth } from '../../Context/AuthContext';
import { useParams } from 'react-router-dom';

const ChapterForm = ({
  currentModule,
  setCurrentModule,
  isEditing,
  setIsEditing,
  currentModuleIndex,
  setCurrentModuleIndex,
  chapterData
}) => {

  const { courseId } = useParams();
  const { Token } = useAuth();
  const { addChapter, updateChapter, deleteChapter } = useCourse();

  const updateModuleField = (field, value) => {
    setCurrentModule((prev) => ({ ...prev, [field]: value }));
  };

  const submitModule = async () => {
    if (!currentModule.ModuleName) {
      alert('Please enter a module name');
      return;
    }

    try {
      const payload = cleanObject({
        ...currentModule
      });

      if (isEditing) {
        if (!currentModule?._id) {
          console.error('Missing module ID while updating');
          return;
        }
        console.log('Updating module with payload:', payload);
        await updateChapter.mutateAsync({
          chapterId: currentModule._id,
          updatedChapter: payload,
          token: Token
        });
      }
      else {
        // Make sure we don't include _id in new chapter creation
        const { _id, ...newChapterPayload } = payload;
        await addChapter.mutateAsync({
          newChapter: newChapterPayload,
          token: Token
        });
      }
      console.log(`Module ${isEditing ? 'updated' : 'created'}`);
    } catch (error) {
      console.error('Error submitting module:', error);
    }
  };

  const deleteModuleHandler = async () => {
    if (!isEditing || currentModuleIndex === null || !currentModule?._id) return;
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      await deleteChapter.mutateAsync({
        chapterId: currentModule._id,
        token: Token
      });
      resetModule();
      console.log('Module deleted successfully');
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const resetModule = () => {
    setCurrentModule({
      CourseId: courseId,
      ModuleName: '',
      ModuleDuration: '',
      ModuleDescription: '',
      Videos: [],
      quizes: [],
    });
    setIsEditing(false);
    setCurrentModuleIndex(null);
  };

  return (
    <div className="rounded-lg shadow-md p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {isEditing ? `Edit Module: ${currentModule.ModuleName}` : 'Create New Module'}
        </h2>
        {isEditing && currentModule?._id && (
          <button
            onClick={deleteModuleHandler}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
          >
            Delete
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Module Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="moduleName" className="block text-sm font-medium mb-1">
              Module Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="moduleName"
              value={currentModule?.ModuleName || ''}
              onChange={(e) => updateModuleField('ModuleName', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="moduleDuration" className="block text-sm font-medium mb-1">
              Duration
            </label>
            <input
              type="text"
              id="moduleDuration"
              value={currentModule?.ModuleDuration || ''}
              onChange={(e) => updateModuleField('ModuleDuration', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label htmlFor="moduleDescription" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="moduleDescription"
            value={currentModule?.ModuleDescription || ''}
            onChange={(e) => updateModuleField('ModuleDescription', e.target.value)}
            className="w-full p-2 border rounded h-[20vh]"
          />
        </div>
      </div>

      {isEditing && currentModule?._id && (
        <>
          <VideoForm
            chapterData={chapterData}
            currentModuleIndex={currentModuleIndex}
            currentModule={currentModule}
            setCurrentModule={setCurrentModule}
          />

          <QuizForm />
        </>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={submitModule}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
        >
          {isEditing && currentModule?._id ? 'Update Module' : 'Create Module'}
        </button>
      </div>
    </div>
  );
};

ChapterForm.propTypes = {
  currentModule: PropTypes.object.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  currentModuleIndex: PropTypes.number,
  setCurrentModuleIndex: PropTypes.func.isRequired,
  chapterData: PropTypes.object.isRequired,
};

export default ChapterForm;