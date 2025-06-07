import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useCourse } from '../Context/CourseContext';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../utils/apiHandler';
import { Plus } from 'lucide-react';
import UploadModel from '../Components/CourseForm/uploadModel';
import ChapterForm from '../Components/CourseForm/ChapterForm';

export default function EditModules() {
  const { courseId } = useParams();
  const { Token } = useAuth();
  const { addChapter, updateChapter, deleteChapter } = useCourse();

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentModule, setCurrentModule] = useState({
    CourseId: courseId,
    ModuleName: '',
    ModuleDescription: '',
    ModuleDuration: '',
    Videos: [],
    quizes: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null);

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: async () => await apiService({
      method: "GET",
      endpoint: `/chapter/course/${courseId}`,
      token: Token
    }),
    enabled: !!courseId && !!Token,
    retry: false
  });

  const { data: courseData } = useQuery({
    queryKey: ['courseData', courseId],
    queryFn: async () => await apiService({
      method: 'GET',
      endpoint: `/getCourse/${courseId}`,
      token: Token
    }),
    enabled: !!courseId && !!Token,
  });

  const openVideoModal = () => setShowVideoModal(true);
  const closeVideoModal = () => setShowVideoModal(false);

  const selectModule = (index) => {
    const selected = chapterData?.chapters?.[index];
    if (!selected) return;
    setCurrentModule(selected);
    setCurrentModuleIndex(index);
    setIsEditing(true);
  };

  const resetModule = () => {
    setCurrentModule({
      CourseId: courseId,
      ModuleName: '',
      ModuleDescription: '',
      ModuleDuration: '',
      Videos: [],
      quizes: [],
    });
    setIsEditing(false);
    setCurrentModuleIndex(null);
  };

  if (isLoading) return <div>Loading chapters...</div>;

  return (
    <div className=" min-h-screen p-6 w-full">
      <div className=" p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Course Modules</h1>
          <button
            onClick={openVideoModal}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Add Videos
          </button>

          {showVideoModal && (
            <UploadModel
              closeVideoModal={closeVideoModal}
              collectionId={courseData?.collectionId}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {chapterData?.chapters?.length > 0 ? (
            chapterData.chapters.map((mod, index) => (
              <button
                key={mod._id}
                onClick={() => selectModule(index)}
                className={`px-4 py-2 rounded-full ${isEditing && currentModuleIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {mod.ModuleName || `Module ${index + 1}`}
              </button>
            ))
          ) : (
            <div className="text-gray-500">No modules available</div>
          )}
          <button
            onClick={resetModule}
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full flex flex-row items-center justify-center"
          >
            <Plus size={20} />
            Add Module
          </button>
        </div>
      </div>

      <ChapterForm
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        addChapter={addChapter}
        updateChapter={updateChapter}
        deleteChapter={deleteChapter}
        courseId={courseId}
        Token={Token}
        currentModuleIndex={currentModuleIndex}
        chapterData={chapterData}
      />
    </div>
  );
}
