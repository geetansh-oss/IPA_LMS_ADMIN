import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddMainSlider = ({ operation, sliderData, closeModel }) => {
  const { Token } = useAuth();
  const { apiService } = useApi();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(sliderData?.title || '');
  const [file, setFile] = useState(null);

  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiService({
        method: "POST",
        endpoint: "/upload-image",
        token: Token,
        data: formData,
      });
      return res.url;
    },
    onError: (err) => {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    }
  });

  const createSliderMutation = useMutation({
    mutationFn: async (sliderData) => {
      const endpoint = operation === "Add"
        ? "/content/mainSlide"
        : `/content/mainSlide/${sliderData._id}`;

      const method = operation === "Add" ? "POST" : "PUT";

      return await apiService({
        method,
        endpoint,
        token: Token,
        data: sliderData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mainSlider"]);
      closeModel();
    },
    onError: (err) => {
      console.error("Slider operation failed:", err);
      alert("Failed to save slider");
    }
  });

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Please enter a title");
    if (operation === "Add" && !file) return alert("Please select an image");

    try {
      let imageUrl = sliderData?.url || "";

      if (file) {
        imageUrl = await uploadImageMutation.mutateAsync(file);
        if (!imageUrl) return;
      }

      const newSlider = {
        title,
        image: imageUrl,
      };

      if (operation === "Edit") {
        newSlider._id = sliderData._id;
      }

      await createSliderMutation.mutateAsync(newSlider);
    } catch (err) {
      console.error("Slider submission error:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 p-6 rounded-lg text-white max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">{operation} Slider</h2>

        <input
          type="text"
          placeholder="Title"
          className="border border-gray-600 bg-gray-800 p-2 rounded w-full mb-4 text-white placeholder-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block w-full bg-gray-800 border border-gray-600 text-gray-300 rounded px-4 py-2 mb-4 cursor-pointer hover:bg-gray-700">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? `📁 ${file.name}` : 'Click to select an image'}
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={uploadImageMutation.isLoading || createSliderMutation.isLoading}
        >
          {uploadImageMutation.isLoading || createSliderMutation.isLoading
            ? "Processing..."
            : `${operation} Slider`}
        </button>
      </div>
    </div>
  );
};

export default AddMainSlider;
