import styles from '../Login/Login.module.scss';
import { useRef, useState } from 'react';
import Loading from '../Loading/Loading';
import { useRouter } from 'next/router';

export default function NewPassword({ email, ableTo, token }) {
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;

    if (password !== confirmPassword) {
      setError('Hasła muszą być identyczne.');
      setLoading(false);
      return;
    }

    const response = await fetch(
      process.env.BASE_URL + '/api/auth/new-password',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setMessage(json.message);
    setLoading(false);

    setTimeout(() => {
      router.replace('/logowanie');
    }, 5000);
  }

  if (!ableTo) {
    return (
      <div className={styles.container}>
        <form>
          <p className='error'>
            Niepoprawny lub przedawniony link. Pamiętaj, że jest on ważny tylko
            przez godzinę od prośby o reset hasła.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Zmiana hasła</h2>
        <p>{email}</p>
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
        <button disabled={loading}>Zmień hasło</button>
        {error && <p className='error'>{error}</p>}
        {message && <p className='message'>{message}</p>}
        {loading && <Loading />}
      </form>
    </div>
  );
}
