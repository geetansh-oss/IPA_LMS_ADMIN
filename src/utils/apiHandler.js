import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiService = async ({ method = 'GET', endpoint, token = null, data = null }) => {
  try {
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
        // Don't touch Content-Type if FormData
        options.body = data;
      } else {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.log(result);
      toast.warn(result?.message || 'Something went wrong');
      return null;
    }
  } catch (error) {
    toast.error('Network error or server not responding');
    console.error('[apiService Error]', error);
    return null;
  }
};
