import axios from 'axios';

const URL = 'http://localhost:8080/accounts/';

const friendsrestprofilesAPI = axios.create({
    baseURL: URL,
    withCredentials: true,
});

const fetcherestprofiles = {
    async getRestUser(id:number) {
        try {
            const response = await friendsrestprofilesAPI.get(`/rest-profiles/${id}`);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
}
export default fetcherestprofiles;