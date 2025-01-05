import axios from '@/lib/axios';

const SettingsServices = {
  async updateSettings(data: any) {
    return axios.patch('/accounts/user-profile/', data);
  },
  async updatePrivacy(privacy: boolean) {
    console.log('privacy:111111111ewewewewewewewewew ', privacy);
    return axios.patch('/accounts/user-settings/', { private_profile: privacy });
  },
  async get2fa() {
    const response = await axios.get('/accounts/user-player/');
    return response.data.enabled_2fa;
  },
  async update2fa(enable: boolean) {
    return axios.post('/accounts/user-player/', { enabled_2fa: enable });
  },
  async updatePassword(password: string, newPassword: string) {
    return axios.post('/accounts/user-player/', {
      old_password: password,
      new_password: newPassword,
    });
  },
};

export default SettingsServices;
