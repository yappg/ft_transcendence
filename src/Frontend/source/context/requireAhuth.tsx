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
    console.log('RA', requiresAuth, 'UN', user?.username, 'etfa', user?.is2FAEnabled, 'vtfa', user?.is2FAvalidated);
    useEffect(() => {
      // RA false UN nourdine etfa true vtfa false
      if (!requiresAuth) {
        if ((user?.username && (!(user?.is2FAEnabled) || user?.is2FAvalidated) ))
          router.push('/home');
        return ;
      } else {
        if (!(user?.username) || (user?.is2FAEnabled && !(user?.is2FAvalidated)))
          router.push('/auth/login');
        return ;
      }
    }, [user, requiresAuth, otp]);

    if ((!requiresAuth && user?.username && (!(user?.is2FAEnabled) || user?.is2FAvalidated) ) ) {
      return ;
    } else if (requiresAuth && (!(user?.username) || (user?.is2FAEnabled && !(user?.is2FAvalidated)))) {
      return ;
    }


    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
