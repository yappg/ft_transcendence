
import axios from 'axios';
import Cookies from 'js-cookie';


const frindsApi = axios.create({
    baseURL: 'http://localhost:8080/relations/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('access_token')}`
    }
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
    async BlockFriend(blockedUsername: string) {
        try {
            const response = await frindsApi.get('/friends/block/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async unblockFriend(unblockedUsername: string) {
        try {
            console.log('Unblocking user:', unblockedUsername, 'called in friendServices')
            const response = await frindsApi.delete('/friends/block/', {
                 data: { unblock_user: unblockedUsername }
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async blockFriend(blockedUsername: string) {
        try {
            const response = await frindsApi.patch('/friends/block/', {
                 block_user: blockedUsername 
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
};


export default FriendServices;
