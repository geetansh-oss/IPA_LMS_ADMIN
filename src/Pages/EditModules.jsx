import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../utils/apiHandler';
import { Plus } from 'lucide-react';
import ChapterForm from '../Components/CourseForm/ChapterForm';

export default function EditModules() {
  const { courseId } = useParams();
  const { Token } = useAuth();
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
    <div>
      <div>
        <div>
          <h1>Course Modules</h1>
        </div>
        <div>
          {chapterData?.chapters?.length > 0 ? (
            chapterData.chapters.map((mod, index) => (
              <button
                key={mod._id || index}
                onClick={() => selectModule(index)}
                className={`px-4 py-2 rounded-full ${isEditing && currentModuleIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {mod.ModuleName}
              </button>
            ))
          ) : (
            <div>No modules available</div>
          )}

          <button
            onClick={resetModule}
            className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            <Plus size={16} />
            Add Module
          </button>
        </div>
      </div>

      <ChapterForm
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        currentModuleIndex={currentModuleIndex}
        setCurrentModuleIndex={setCurrentModuleIndex}
        chapterData={chapterData}
      />
    </div>
  );
}