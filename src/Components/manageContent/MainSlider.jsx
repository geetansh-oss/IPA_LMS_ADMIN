import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../Context/AuthContext';
import { useApi } from '../../hooks/useApi';
import AddMainSlider from '../Modal/AddMainSlider';

const MainSlider = () => {
  const { Token } = useAuth();
  const { apiService } = useApi();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null); // for edit

  const { data: sliderData, isLoading } = useQuery({
    queryKey: ['mainSliderData'],
    queryFn: async () => {
      const response = await apiService({
        method: 'GET',
        endpoint: '/content/mainSlide',
        token: Token,
      });
      return response.data;
    },
    enabled: !!Token,
  });

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
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Main Slider</h1>

      {sliderData && sliderData.length > 0 ? (
        sliderData.map((slider) => (
          <div key={slider._id} className="border rounded p-4 mb-4">
            <h2 className="text-lg font-semibold">{slider.title}</h2>
            <img src={slider.imageUrl} alt={slider.title} className="w-64 h-auto my-2" />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingSlider(slider);
                  setShowModal(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => deleteSlider.mutate(slider._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No slider data available.</p>
      )}

      <button
        onClick={() => {
          setEditingSlider(null);
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Add New Slider
      </button>

      {showModal && (
        <AddMainSlider
          operation={editingSlider ? 'Edit' : 'Add'}
          sliderData={editingSlider}
          closeModel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MainSlider;
