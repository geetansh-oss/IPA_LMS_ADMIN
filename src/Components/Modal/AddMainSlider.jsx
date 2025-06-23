import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { apiService } from "../../utils/apiHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

const AddMainSlider = ({ operation, sliderData, closeModel }) => {
  const { Token } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(sliderData?.title || '');
  const [file, setFile] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

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
      alert(`${operation} slider successfully!`);
    },
    onError: (err) => {
      console.error("Slider operation failed:", err);
      // More descriptive error message
      const errorMessage = err.response?.data?.message || "Failed to save slider";
      alert(errorMessage);
    }
  });

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    
    if (operation === "Add" && !file) {
      alert("Please select an image");
      return;
    }

    try {
      let imageUrl = sliderData?.url || "";

      if (file) {
        setIsImageUploading(true);
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiService({
          method: "POST",
          endpoint: "/upload-image",
          token: Token,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        imageUrl = response?.url || response?.data?.url || response;
        setIsImageUploading(false);
        
        if (!imageUrl) {
          alert("Failed to upload image");
          return;
        }
      }

      const newSlider = {
        title: title.trim(),
        url: imageUrl,
      };

      if (operation === "Edit") {
        newSlider._id = sliderData._id;
      }

      await createSliderMutation.mutateAsync(newSlider);
    } catch (err) {
      console.error("Slider submission error:", err);
      setIsImageUploading(false);
      const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
      alert(errorMessage);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // File validation
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4','video/mkv'];
      const maxSize = 20 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP, MP4, MKV)");
        return;
      }
      
      if (selectedFile.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const isLoading = createSliderMutation.isLoading || isImageUploading;

  // Extracted button text logic to avoid nested ternary
  let buttonText = `${operation} Slider`;
  if (isImageUploading) {
    buttonText = "Uploading...";
  } else if (createSliderMutation.isLoading) {
    buttonText = "Saving...";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 p-6 rounded-lg text-white max-w-md mx-auto relative">
        {/* Close button */}
        <button
          onClick={closeModel}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">{operation} Slider</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="slider-title" className="block text-sm font-medium mb-1">Title</label>
            <input
              id="slider-title"
              type="text"
              placeholder="Enter slider title"
              className="border border-gray-600 bg-gray-800 p-2 rounded w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="slider-image" className="block text-sm font-medium mb-1">Image</label>
            <label htmlFor="slider-image" className="block w-full bg-gray-800 border border-gray-600 text-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors">
              <input
                id="slider-image"
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {file ? (
                <span className="flex items-center">
                  <span className="mr-2">📁</span>
                  <span className="truncate">{file.name}</span>
                </span>
              ) : (
                <span>Click to select an image</span>
              )}
            </label>
            {operation === "Edit" && sliderData?.url && !file && (
              <p className="text-xs text-gray-400 mt-1">Current image will be kept if no new image is selected</p>
            )}
          </div>
        </div>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {buttonText}
          </button>
        </div>
      </div>
  );
};

AddMainSlider.propTypes = {
  operation: PropTypes.oneOf(["Add", "Edit"]).isRequired,
  sliderData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
  closeModel: PropTypes.func.isRequired,
};

export default AddMainSlider;