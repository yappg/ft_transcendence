import axios from "axios";

const axiosInstance = axios.create({
  //   baseURL: process.env.NEXT_PUBLIC_API_URL, //
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          document.cookie =
            "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie =
            "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          window.location.href = "/auth/login";
          break;
        // // case 403: // Forbidden
        // window.location.href = '/';
        // break;
        // case 404: // Not Found
        // window.location.href = '/';
        // break;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
