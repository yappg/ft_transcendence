
import axios from 'axios';
import Cookies from 'js-cookie';


const frindsApi = axios.create({
    baseURL: 'http://localhost:8080/relations/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('access_token')}`
    }
});

// const achivementsApi = axios.create({
//     baseURL: 'http://localhost:8080/accounts/relations/achivments',
//     headers: {
//         'Content-Type': 'application',
//         'Authorization': `Bearer ${Cookies.get('access_token')}`

//     }
// });

const FriendServices = {
    async getPlayers() {
        try {
            const response = await frindsApi.get('/players/');
            return response.data;
        }
        catch (error) {
            return error;
        }
    },

    async getFriends() {
        try {
            const response = await frindsApi.get('/friends/');
            return response.data;
        }
        catch (error) {
            return error;
        }
    },

    async getFriendRequests() {
        try {
            const response = await frindsApi.get('/friends/pending/');
            return response.data;
        }
        catch (error) {
            return error;
        }
    },

    async sendFriendRequest(receiverUsername: string) {
        try {
            const response = await frindsApi.post('/friends/invite/', {
                receiver: receiverUsername
            });
            return response;
        }
        catch (error) {
            return error;
        }
    },

    async acceptFriendRequest(senderUsername: string) {
        try {
            const response = await frindsApi.post('/friends/accept/', {
                sender: senderUsername
            });
            return response;
        }
        catch (error) {
            return error;
        }
    },

};


export default FriendServices;
