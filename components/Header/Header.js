import Link from 'next/link';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';
import scrollToId from '../../lib/scrollToId';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const router = useRouter();

  const { data: session, status } = useSession();

  return (
    <header className={styles.container}>
      <h5 onClick={() => scrollToId('hero', router)}>Make-up Maja Pyrzyńska</h5>
      <nav>
        <ul>
          <li onClick={() => scrollToId('aboutMe', router)}>
            <h5>O mnie</h5>
          </li>
          <li onClick={() => scrollToId('contact', router)}>
            <h5>Kontakt</h5>
          </li>
          <li onClick={() => scrollToId('reviews', router)}>
            <h5>Opinie</h5>
          </li>
          <li onClick={() => scrollToId('hero', router)}>
            <h5>Portfolio</h5>
          </li>
          {status === 'authenticated' ? (
            <li onClick={signOut} className={styles.logoutButton}>
              <h5>Wyloguj</h5>
            </li>
          ) : (
            <Link href='/logowanie'>
              <li>
                <h5>Logowanie/Rejestracja</h5>
              </li>
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
}
