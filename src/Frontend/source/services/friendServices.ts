import axios from '@/lib/axios';

const FriendServices = {
    async getPlayers() {
        try {
            const response = await axios.get('/relations/players/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async getFriends() {
        try {
            const response = await axios.get('/relations/friends/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async getFriendRequests() {
        try {
            const response = await axios.get('/relations/friends/pending/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async sendFriendRequest(receiverUsername: string) {
        try {
            const response = await axios.post('/relations/friends/invite/', {
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
            const response = await axios.post('/relations/friends/accept/', {
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
            const response = await axios.get('/relations/friends/block/');
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async blockFriend(blockedUsername: string) {
        try {
            const response = await axios.patch('/relations/friends/block/', {
                block_user: blockedUsername
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },

    async unblockFriend(unblockedUsername: string) {
        try {
            // console.log('Unblocking user:', unblockedUsername, 'called in friendServices')
            const response = await axios.delete('/relations/friends/block/', {
                data: { unblock_user: unblockedUsername }
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
};

export default FriendServices;
