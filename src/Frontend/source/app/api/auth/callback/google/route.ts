import axiosInstance from '@/lib/axios';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
      
        const response = await axiosInstance.get('http://backend:8080/accounts/oauth/callback/google/', {
            params: {
                code: encodeURIComponent(code || ''),
            },
        });
        console.log('cookies-------lllll  ::: ', response.headers, 'response.data kkekd', response.data);
        const headers = new Headers();
        const accessToken = response.headers['set-cookie']?.find(cookie => cookie.startsWith('access_token='));
        const refreshToken = response.headers['set-cookie']?.find(cookie => cookie.startsWith('refresh_token='));

        if (accessToken && refreshToken) {
            headers.append('Set-Cookie', accessToken);
            headers.append('Set-Cookie', refreshToken);
        }

        return new Response(null, {
            status: 302,
            headers: {
                ...headers,
                Location: '/home'
            }
        });

    } catch (e) {
        console.log(e);
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/auth/login'
            }
        });
    }   
} 