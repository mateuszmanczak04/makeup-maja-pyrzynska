import styles from '../Login/Login.module.scss';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Loading from '../Loading/Loading';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function Register() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const usernameInputRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = emailInputRef.current.value;
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;

    if (password !== confirmPassword) {
      setError('Hasła muszą być identyczne.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
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
        <h2>Rejestracja</h2>
        <label>
          <h5>E-mail</h5>
          <input type='email' ref={emailInputRef} defaultValue='' />
        </label>
        <label>
          <h5>Nazwa użytkownika</h5>
          <input type='text' ref={usernameInputRef} defaultValue='' />
        </label>
        <label>
          <h5>Hasło</h5>
          <input type='password' ref={passwordInputRef} defaultValue='' />
        </label>
        <label>
          <h5>Powtórz hasło</h5>
          <input
            type='password'
            ref={confirmPasswordInputRef}
            defaultValue=''
          />
        </label>
        <button disabled={loading}>Zarejestruj</button>
        <Link href='/logowanie'>Masz już konto?</Link>
        {error && <p className='error'>{error}</p>}
        {loading && <Loading />}
      </form>
    </div>
  );
}
