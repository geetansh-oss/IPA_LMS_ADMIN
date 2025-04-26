import { Upload } from 'lucide-react';

export default function VideoUploader({ videoPreviewUrl, videoFile, isLoading, videoInputRef, handleVideoChange, handleUploadVideo }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center w-full">
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoChange}
        accept="video/*"
        className="hidden"
      />

      {videoPreviewUrl ? (
        <div className="w-full max-w-md mx-auto">
          <div className="w-full overflow-hidden rounded-md mb-4">
            <video
              controls
              src={videoPreviewUrl}
              className="w-full max-w-md aspect-video object-cover rounded-md mb-4"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 truncate">{videoFile?.name}</span>
            <div className="flex gap-3">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => videoInputRef.current.click()}
              >
                Change video
              </button>
              <button
                type="button"
                onClick={handleUploadVideo}
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
          onClick={() => videoInputRef.current.click()}
          className="flex flex-col items-center justify-center py-8 w-full"
        >
          <Upload size={40} className="text-gray-400 mb-2" />
          <p className="text-gray-700 font-medium">Click to upload intro video</p>
          <p className="text-gray-500 text-sm mt-1">Recommended .mp4</p>
        </button>
      )}
    </div>
  );
}
