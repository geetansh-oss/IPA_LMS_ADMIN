import MainSlider from '../Components/manageContent/MainSlider';
import FacultySlider from '../Components/manageContent/FacultySlider';

const ManageContent = () => {

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
          Manage Content
        </h1>
        
        {/* Main Slider Section */}
        <div className="mb-12">
          <MainSlider />
        </div>
        
        {/* Faculty Slider Section */}
        <div className="mb-12">
          <FacultySlider />
        </div>
      </div>
    </div>
  )
}

export default ManageContent;