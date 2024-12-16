import { toast } from './use-toast';

export class OAuthClient {
  private static async fetchWithOAuth(endpoint: string) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
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
        description: 'error.messagedfzffz',
        className: 'bg-primary-dark border-none text-white bg-opacity-20',
      });
    }
  }

  static async google() {
    this.fetchWithOAuth('google');
  }

  static async intra42() {
    this.fetchWithOAuth('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-4aedcd9bbfe99586bd8aab9967a260dd24e4a1459620fe008ae457eae916624c&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fhome&response_type=code');
  }
}

//   /api/oauth/login/42/ OR /api/oauth/login/google/
