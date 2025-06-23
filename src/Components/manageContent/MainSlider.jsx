import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';
import { apiService } from '../../utils/apiHandler';
import AddMainSlider from '../Modal/AddMainSlider';

const MainSlider = () => {
  const { Token } = useAuth();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Query for fetching slider data
  const {
    data: sliderData,
    isLoading,
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['mainSliderData'],
    queryFn: async () => {
      const response = await apiService({
        method: 'GET',
        endpoint: '/content/mainSlide',
        token: Token,
      });
      console.log("Slider data response:", response);
      return response.slides;
    },
    enabled: !!Token,
  });

  // Mutation for deleting slider
  const deleteSlider = useMutation({
    mutationFn: async (id) => {
      return await apiService({
        method: 'DELETE',
        endpoint: `/deleteMainSlider/${id}`,
        token: Token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mainSliderData']);
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      // You could add toast notification here
    },
  });

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSlider(null);
    setShowModal(true);
  };

  const handleDelete = (slider) => {
    setDeleteConfirm(slider);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSlider.mutate(deleteConfirm._id);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSlider(null);
  };

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen">
        <h1 className="text-xl font-bold mb-4 text-white">Main Slider</h1>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-gray-300">Loading sliders...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen">
        <h1 className="text-xl font-bold mb-4 text-white">Main Slider</h1>
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-200 font-medium">Error loading sliders</h3>
          <p className="text-red-300 text-sm mt-1">
            {fetchError.message || 'Failed to load slider data'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Main Slider Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          aria-label="Add new slider"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Slider
        </button>
      </div>

      {/* Slider Grid */}
      {sliderData && sliderData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliderData.map((slider) => (
            <div key={slider._id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-200">
              <div className="aspect-video bg-gray-700 rounded-t-lg overflow-hidden">
                {isVideo(slider.url) ? (
                  <video
                    src={slider.url}
                    controls
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <img
                    src={slider.url}
                    alt={slider.title}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                  {slider.title}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(slider)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                    aria-label={`Edit ${slider.title}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(slider)}
                    disabled={deleteSlider.isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:text-gray-400 text-white px-3 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                    aria-label={`Delete ${slider.title}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-white">No sliders found</h3>
          <p className="mt-1 text-sm text-gray-400">Get started by creating your first slider.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddMainSlider
          operation={editingSlider ? 'Edit' : 'Add'}
          sliderData={editingSlider}
          closeModel={handleModalClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-medium text-white mb-4">
              Delete Slider
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteSlider.isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:text-gray-400 rounded-md transition-colors"
              >
                {deleteSlider.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSlider;