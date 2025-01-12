export class AuthClient {
  private static readonly BASE_URL =
    process.env.NEXT_PUBLIC_API_URL + "/accounts/auth";
  private static async fetchWithAuth(
    endpoint: string,
    data: Record<string, any>,
  ) {
    delete data.password2;
    console.log(process.env.NEXT_PUBLIC_API_URL);
    try {
      const response = await fetch(`${AuthClient.BASE_URL}/${endpoint}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication error: ${error.message}`);
      }

      throw new Error("Authentication failed");
    }
  }

  static async signup(data: Record<string, any>) {
    return this.fetchWithAuth("signup", data);
  }

  static async signin(data: Record<string, any>) {
    const response = await this.fetchWithAuth("signin", data);
    console.log("response: ", response);
    return response;
  }
}
