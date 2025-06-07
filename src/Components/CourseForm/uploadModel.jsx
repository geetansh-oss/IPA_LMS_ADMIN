import PropTypes from 'prop-types';

const UploadModel = ({closeVideoModal}) => {
  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-black text-white rounded-lg p-6 w-[90%] max-w-md shadow-lg z-50 relative">
        <h2 className="text-xl font-semibold mb-4">Upload Videos</h2>

        {/* Your upload form or content here */}
        <input type="file" multiple className="mb-4" />
        <p className="text-gray-400 mb-4">
          Supported formats: MP4, MKV.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeVideoModal}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle upload logic
              closeVideoModal();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

UploadModel.propTypes = {
  closeVideoModal: PropTypes.func.isRequired,
};

export default UploadModel;