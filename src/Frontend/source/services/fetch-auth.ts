export class AuthClient {
  private static readonly BASE_URL = 'http://localhost:8080/accounts/auth';
  private static async fetchWithAuth(endpoint: string, data: Record<string, any>) {
    delete data.password2;
    console.log(data);
    try {
      const response = await fetch(`${AuthClient.BASE_URL}/${endpoint}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication error: ${error.message}`);
      }

      throw new Error('Authentication failed');
    }
  }

  static async signup(data: Record<string, any>) {
    return this.fetchWithAuth('signup', data);
  }

  static async signin(data: Record<string, any>) {
    return this.fetchWithAuth('signin', data);
  }
}
