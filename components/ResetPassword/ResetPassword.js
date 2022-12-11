import { useRef, useState } from 'react';
import Loading from '../Loading/Loading';
import styles from '../Login/Login.module.scss';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const res = await fetch('/api/auth/send-reset-password-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setMessage(json.message);
    setEmail('');
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Reset hasła</h2>
        <label>
          <h5>E-mail</h5>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button disabled={loading}>Wyślij link</button>

        {error && <p className='error'>{error}</p>}
        {message && <p className='message'>{message}</p>}
        {loading && <Loading />}
      </form>
    </div>
  );
};

export default ResetPassword;
