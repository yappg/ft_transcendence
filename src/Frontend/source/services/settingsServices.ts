import axios from '@/lib/axios';

const SettingsServices = {
    async updateSettings(data: any) {
        const response = await axios.patch('/accounts/user-profile/', data);
        return response.data;
    }
}

export default SettingsServices;