import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Account from '../components/Account/Account';
import Loading from '../components/Loading/Loading';

export default function Konto() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/logowanie');
    }
  }, [status, router]);

  if (status !== 'authenticated') return <Loading />;

  return <Account />;
}
