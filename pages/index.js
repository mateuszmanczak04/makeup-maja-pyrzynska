import { useSession } from 'next-auth/react';
import Home from '../components/Home/Home';

export default function HomePage({ reviews }) {
  const { data: session, status } = useSession();

  return <Home reviews={reviews} />;
}
