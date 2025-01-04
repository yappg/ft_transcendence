import axiosInstance from '@/lib/axios';
import { toast } from '../hooks/use-toast';

export class OAuthClient {
  private static async fetchWithOAuth(endpoint: string) {
    try {
      //  TODO: add google oauth
      const response = await fetch(endpoint, {
        method: 'GET',
      });
      console.log(response);
    } catch (error: any) {
      toast({
        title: 'error',
        description: error,
        className: 'bg-primary-dark border-none text-white bg-opacity-20',
      });
    }
  }

  static async google() {
    const authUrl = await axiosInstance.get('http://localhost:8080/accounts/oauth/login/google/');
    window.location.href = authUrl.data.url;
  }

  static async intra42() {
    const authUrl = await axiosInstance.get('http://localhost:8080/accounts/oauth/login/42/');
    // console.log('--------42', authUrl);
    window.location.href = authUrl.data.url;
  }
}

//   /api/oauth/login/42/
// /api/oauth/login/google/
