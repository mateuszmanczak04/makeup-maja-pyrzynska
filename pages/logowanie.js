import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Login from '../components/Login/Login';
import { signIn, providers, getSession, csrfToken } from 'next-auth/react';

export default function Logowanie({ providers }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [router, session]);

  return <Login />;
}
