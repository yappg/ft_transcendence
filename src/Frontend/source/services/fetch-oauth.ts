import axios from '@/lib/axios';

export class OAuthClient {
  static async google() {
    try {
      const authUrl = await axios.get('/accounts/oauth/login/google/');
      window.location.href = authUrl.data.url;
    } catch (error) {
      console.error('Google OAuth error:', error);
    }
  }

  static async intra42() {
    try {
      const authUrl = await axios.get('/accounts/oauth/login/42/');
      window.location.href = authUrl.data.url;
    } catch (error) {
      console.error('42 OAuth error:', error);
    }
  }
}
