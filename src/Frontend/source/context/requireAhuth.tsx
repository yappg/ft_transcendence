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
      if (!requiresAuth) {
        if (user?.username && !user?.is2FAEnabled && user?.is2FAvalidated) {
          return;
        }
        if (user?.username && (!user?.is2FAEnabled || user?.is2FAvalidated)) {
          router.push('/home');
        }
      } else {
        if (!user?.username || (user?.is2FAEnabled && !user?.is2FAvalidated)) {
          router.push('/auth/login');
        }
      }
    }, [user, requiresAuth, router]);

    if (user?.username && !user?.is2FAEnabled && user?.is2FAvalidated) {
      return <WrappedComponent {...props} />;
    }
    if (!requiresAuth && user?.username && (!user?.is2FAEnabled || user?.is2FAvalidated)) {
      return null;
    } else if (requiresAuth && (!user?.username || (user?.is2FAEnabled && !user?.is2FAvalidated))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;

// 2 cumon issues user not been updated in use context
// and also conditions needs to fit signup in require auth and alse 2fa-validated var been set
// problem now only in a rendring before redirection that is not neccessary in login and signup when requesting them
