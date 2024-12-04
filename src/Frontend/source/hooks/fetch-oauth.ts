import { toast } from './use-toast';

export class OAuthClient {
  private static readonly BASE_URL = 'http://localhost:8080/api/oauth/login';
  private static async fetchWithOAuth(endpoint: string) {
    try {
      const response = await fetch(`${OAuthClient.BASE_URL}/${endpoint}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
    //   if (response.message) {
    //     toast({
    //       title: 'Success',
    //       description: response.message,
    //       className: 'bg-primary border-none text-white bg-opacity-20',
    //     });
    //   } else if (response.error || response.detail) {
    //     toast({
    //       title: 'error',
    //       description: 'hello',
    //       className: 'bg-primary-dark border-none text-white bg-opacity-20',
    //     });
    //   }
    } catch (error: any) {
      toast({
        title: 'error',
        description: error.detail,
        className: 'bg-primary-dark border-none text-white bg-opacity-20',
      });
    }
  }

  static async google() {
    this.fetchWithOAuth('google');
  }

  static async intra42() {
    this.fetchWithOAuth('42');
  }
}

//   /api/oauth/login/42/ OR /api/oauth/login/google/
