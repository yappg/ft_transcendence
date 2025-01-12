import { toast } from "@/hooks/use-toast";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  },
});

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          document.cookie =
            "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie =
            "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          window.location.href = "/auth/login";
          break;
      }
      switch (error.response.status) {
        case 403:
          toast({
            title: "access denied",
            description: "Oups Somthing went wrong !",
            variant: "destructive",
            className: "bg-primary-dark border-none text-white",
          });
          break;
      }
      switch (error.response.status) {
        case 404:
          toast({
            title: "access denied",
            description: "Oups Somthing went wrong !",
            variant: "destructive",
            className: "bg-primary-dark border-none text-white",
          });
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
