'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const withAuth = (
  WrappedComponent: React.ComponentType,
  requiresAuth: boolean,
  otp?: string,
) => {
  return (props: any) => {
    const { user } = useAuth();
    const router = useRouter();


    useEffect(() => {
      if (user?.is2FAEnabled) {
        router.push(`/2fa/login-2fa`);
        return;
      }
      if (requiresAuth && !user) {
        console.log('dkhelhna1');
        router.push('/auth/login');
      } else if (!requiresAuth && user) {
        if (otp === 'signup') {
            router.push(`/2fa/${otp}-2fa`);
            return;
        }
        console.log('dkhelhna2');
        router.push('/home');
      }
    }, [user, requiresAuth, otp]);

    if (user?.is2FAEnabled) {
      return null;
    }
    
    if (requiresAuth && !user) {
      return null;
    }

    if (!requiresAuth && user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
