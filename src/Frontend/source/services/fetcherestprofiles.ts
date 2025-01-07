import axios from '@/lib/axios';

const fetcherestprofiles = {
  async getRestUser(id: number) {
    try {
      const response = await axios.get(`/accounts/rest-profiles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default fetcherestprofiles;
