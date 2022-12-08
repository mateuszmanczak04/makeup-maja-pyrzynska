import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Register from '../components/Register/Register';

export default function Rejestracja() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [router, session]);

  return <Register />;
}
