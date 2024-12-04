'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const withAuth = (
  WrappedComponent: React.ComponentType,
  requiresAuth: boolean,
  authSignup?: boolean
) => {
  return (props: any) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      console.log(
        'requireauth: ',
        requiresAuth,
        'user',
        user,
        'result: ',
        requiresAuth && !user,
        !requiresAuth && user
      );
      
      if (requiresAuth && !user) {
        console.log('dkhelhna1');
        router.push('/auth/login');
      } else if (!requiresAuth && user) {
        if (authSignup) {
            router.push('/2fa/signup-2fa');
            return;
        }
        console.log('dkhelhna2');
        router.push('/home');
      }
    }, [user, requiresAuth, authSignup]);

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
