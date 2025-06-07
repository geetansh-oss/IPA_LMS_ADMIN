import { apiService } from '../utils/apiHandler';


export const uploadVideo = async (videoFile, CollectionId) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    const response = await apiService({
      method: 'POST',
      endpoint: '/uploadVideo',
      data: formData,
      token: Token
    });
    return response.videoId; // Assuming the response contains the videoId
  }
  catch (error) {
    console.error('Error uploading video:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

