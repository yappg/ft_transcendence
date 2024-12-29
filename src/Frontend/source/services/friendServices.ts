
import axios from 'axios';


const frindsApi = axios.create({
    baseURL: 'http://localhost:8080/relations/',
    withCredentials: true,
});


const FriendServices = {
    async getPlayers() {
        try {
            const response = await frindsApi.get('/players/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async getFriends() {
        try {
            const response = await frindsApi.get('/friends/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async getFriendRequests() {
        try {
            const response = await frindsApi.get('/friends/pending/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async sendFriendRequest(receiverUsername: string) {
        try {
            const response = await frindsApi.post('/friends/invite/', {
                receiver: receiverUsername
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async acceptFriendRequest(senderUsername: string) {
        try {
            const response = await frindsApi.post('/friends/accept/', {
                sender: senderUsername
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
    async getBlocked() {
        try {
            const response = await frindsApi.get('/friends/block/')
            return response.data;
        }
        catch(error) {
            throw error;
        }
    },
    async unblockFriend(name: string){
        try {
            const response = await frindsApi.delete('/friends/block/', {
                data: { unblock_user: name },
            });
            return response.data;
        }
        catch(error) {
            throw error;
        }
    }
};


export default FriendServices;
