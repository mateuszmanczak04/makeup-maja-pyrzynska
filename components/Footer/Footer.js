import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.container}>
      <p className='sm'>
        Designed and developed by Mateusz Mańczak{' '}
        <a href='https://www.facebook.com/mateusz.mancxzak/' target='blank'>
          https://www.facebook.com/mateusz.mancxzak/
        </a>
      </p>
    </footer>
  );
}
