import { Image } from 'lucide-react';

export default function ThumbnailUploader({ imagePreviewUrl, thumbnailFile, isLoading, thumbnailInputRef, handleThumbnailChange, handleUploadThumbnail }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center w-full">
      <input
        type="file"
        ref={thumbnailInputRef}
        onChange={handleThumbnailChange}
        accept="image/*"
        className="hidden"
      />

      {imagePreviewUrl ? (
        <div className="w-full max-w-md mx-auto">
          <div className="w-full overflow-hidden rounded-md mb-4">
            <img
              src={imagePreviewUrl}
              alt="Thumbnail preview"
              className="w-full max-w-md aspect-video object-cover rounded-md mb-4"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-600 truncate">{thumbnailFile?.name}</span>
            <div className="flex gap-3">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => thumbnailInputRef.current.click()}
              >
                Change image
              </button>
              <button
                type="button"
                onClick={handleUploadThumbnail}
                disabled={isLoading}
                className="text-sm bg-blue-500 rounded-xl px-3 py-1.5 hover:bg-blue-600 text-white"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => thumbnailInputRef.current.click()}
          className="flex flex-col items-center justify-center py-8 w-full"
        >
          <Image size={40} className="text-gray-400 mb-2" />
          <p className="text-gray-700 font-medium">Click to upload thumbnail</p>
          <p className="text-gray-500 text-sm mt-1">JPG, PNG, or WebP</p>
        </button>
      )}
    </div>
  );
}
