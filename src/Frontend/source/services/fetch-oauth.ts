import axios from "@/lib/axios";

export class OAuthClient {
  static async google() {
    try {
      const authUrl = await axios.get("/accounts/oauth/login/google/");
      // console.log('authUrl ---------- ', authUrl.data.url);
      window.location.href = authUrl.data.url;
    } catch (error) {
      console.log("Google OAuth error:", error);
    }
  }

  static async intra42() {
    try {
      const authUrl = await axios.get("/accounts/oauth/login/42/");
      // console.log('authUrl ---------- ', authUrl.data.url);
      window.location.href = authUrl.data.url;
    } catch (error) {
      console.log("42 OAuth error:", error);
    }
  }
}
