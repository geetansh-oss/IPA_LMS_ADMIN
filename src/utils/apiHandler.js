import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiService = async ({ method = 'GET', endpoint, token = null, data = null }) => {
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method: method.toUpperCase(),
    headers,
  };

  if (data && method !== 'GET') {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      // ❗ Throw error to be caught by useMutation's onError
      const error = new Error(result?.message || 'Something went wrong');
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result;
  } catch (error) {
    // ✅ Optional toast — only show if network error, not on API error
    if (!error.status) {
      toast.error('Network error or server not responding');
      console.error('[apiService Network Error]', error);
    }

    throw error;
  }
};
