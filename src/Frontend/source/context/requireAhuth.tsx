'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

function withAuth(WrappedComponent: React.ComponentType, requiresAuth: boolean, otp?: string) {
  return function AuthWrapper(props: any) {
    const { user } = useAuth();
    const router = useRouter();

    console.log(
      'RA',
      requiresAuth,
      'UN',
      user?.username,
      'etfa',
      user?.is2FAEnabled,
      'vtfa',
      user?.is2FAvalidated
    );

    useEffect(() => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      if (!requiresAuth) {
        if (user?.username && (!user?.is2FAEnabled || user?.is2FAvalidated)) {
          router.push('/home');
        }
      } else {
        if (!user?.username || (user?.is2FAEnabled && !user?.is2FAvalidated)) {
          router.push('/auth/login');
        }
      }
    }, [user, requiresAuth, router]);

    if (!requiresAuth && user?.username && (!user?.is2FAEnabled || user?.is2FAvalidated)) {
      return null;
    } else if (requiresAuth && (!user?.username || (user?.is2FAEnabled && !user?.is2FAvalidated))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
