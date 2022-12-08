import Link from 'next/link';
import { useState } from 'react';
import styles from './SideNav.module.scss';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrFormClose } from 'react-icons/gr';
import scrollToId from '../../lib/scrollToId';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className={styles.container}>
      <div className={styles.openButton}>
        <GiHamburgerMenu onClick={toggleOpen} />
      </div>
      <div
        className={`${styles.backdrop} ${isOpen && styles.open}`}
        onClick={toggleOpen}></div>
      <div className={`${styles.aside} ${isOpen && styles.open}`}>
        <div className={styles.content}>
          <div className={styles.closeButton}>
            <GrFormClose onClick={toggleOpen} />
          </div>
          <h5
            onClick={() => {
              scrollToId('hero', router);
              toggleOpen();
            }}>
            Make-up Maja Pyrzyńska
          </h5>
          <nav>
            <ul>
              <li
                onClick={() => {
                  scrollToId('aboutMe', router);
                  toggleOpen();
                }}>
                <h5>O mnie</h5>
              </li>
              <li
                onClick={() => {
                  scrollToId('contact', router);
                  toggleOpen();
                }}>
                <h5>Kontakt</h5>
              </li>
              <li
                onClick={() => {
                  scrollToId('reviews', router);
                  toggleOpen();
                }}>
                <h5>Opinie</h5>
              </li>
              <li
                onClick={() => {
                  scrollToId('hero', router);
                  toggleOpen();
                }}>
                <h5>Portfolio</h5>
              </li>
              {status === 'authenticated' ? (
                <li
                  onClick={() => {
                    signOut();
                    toggleOpen();
                  }}
                  className={styles.logoutButton}>
                  <h5>Wyloguj</h5>
                </li>
              ) : (
                <Link href='/logowanie'>
                  <li onClick={toggleOpen}>
                    <h5>Logowanie/Rejestracja</h5>
                  </li>
                </Link>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
