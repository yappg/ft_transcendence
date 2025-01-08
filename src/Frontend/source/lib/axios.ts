import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
});

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.href = '/auth/login';
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
