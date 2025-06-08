import { apiService } from '../utils/apiHandler';


export const uploadVideo = async (videoFile, CollectionId, Token) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('collectionId', CollectionId);
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

export const cleanObject = (obj) => {
  const { _id, ...rest } = obj;
  const newObj = {};
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      newObj[key] = value;
    }
  });
  return newObj;
};

