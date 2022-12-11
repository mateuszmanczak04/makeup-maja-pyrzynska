import Link from 'next/link';
import { useRef, useState } from 'react';
import styles from './Login.module.scss';
import { signIn, getSession, csrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '../Loading/Loading';

export default function Login({ providers }) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/');
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Logowanie</h2>
        <label>
          <h5>E-mail</h5>
          <input type='email' ref={emailInputRef} defaultValue='' />
        </label>
        <label>
          <h5>Hasło</h5>
          <input type='password' ref={passwordInputRef} defaultValue='' />
        </label>
        <button disabled={loading}>Zaloguj</button>

        <div className={styles.google} onClick={() => signIn('google')}>
          Zaloguj się z Google
        </div>

        <Link href='/rejestracja'>Potrzebujesz konta?</Link>
        <Link href='/reset-hasla'>Zapomniałeś hasła?</Link>
        {error && <p className='error'>{error}</p>}
        {loading && <Loading />}
      </form>
    </div>
  );
}
