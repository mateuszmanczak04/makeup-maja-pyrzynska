import styles from './Account.module.scss';
import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '../Loading/Loading';
import Image from 'next/image';

const Account = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setError('');
      setLoading(true);
      const res = await fetch('/api/user', {
        method: 'GET',
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message);
        setLoading(false);
        return;
      }

      setUsername(json.username);
      setEmail(json.email);
      setEmailVerified(json.emailVerified);
      setHasPassword(json.hasPassword);
      setImagePath(json.avatar);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSendVerificationEmail = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/auth/send-verification-email', {
      method: 'POST',
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setMessage(json.message);
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Hasła muszą być identyczne.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setMessage(json.message);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setLoading(false);
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/user/change-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUsername: username }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setMessage(json.message);
    setLoading(false);
  };

  const handleUploadProfileImage = async (e) => {
    setLoading(true);
    setMessage('');
    setError('');
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/images/upload-profile-image', {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    });
    console.log('profile image updated');

    const json = await response.json();

    console.log(json);

    if (!response.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setImagePath(json.imagePath);
    setMessage(json.message);
    setLoading(false);
  };

  const handleSaveProfileImage = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    const res = await fetch('/api/user/change-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagePath }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setMessage(json.message);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h5>{email}</h5>
        <form autoComplete='new-password' onSubmit={handleChangeUsername}>
          <label>
            <p>Nazwa użytkownika</p>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete='new-password'
            />
            <button>Zmień nazwę użytkownika</button>
          </label>
        </form>
        <label>
          <input
            type='file'
            name='image'
            onChange={handleUploadProfileImage}
            accept='image/png,image/gif,image/jpeg'
          />
          <Image
            src={imagePath || '/images/avatars/default.jpg'}
            alt='zdjęcie profilowe'
            width={300}
            height={300}
          />
          <div className={styles.info}>Naciśnij, aby wybrać nowe zdjęcie</div>
        </label>
        <button onClick={handleSaveProfileImage}>
          Zapisz zdjęcie profilowe
        </button>
        {hasPassword && (
          <form autoComplete='new-password' onSubmit={handleChangePassword}>
            <label>
              <p>Stare hasło</p>
              <input
                type='password'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete='new-password'
              />
            </label>
            <label>
              <p>Nowe hasło</p>
              <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete='new-password'
              />
            </label>
            <label>
              <p>Powtórz nowe hasło</p>
              <input
                type='password'
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                autoComplete='new'
              />
            </label>
            <button>Zmień hasło</button>
          </form>
        )}
        {!emailVerified && (
          <button onClick={handleSendVerificationEmail}>
            Wyślij e-mail z prośbą o potwierdzenie rejestracji
          </button>
        )}
        <button
          onClick={() => {
            signOut();
            router.push('/logowanie');
          }}
          className={styles.logoutButton}>
          Wyloguj
        </button>
        {error && <p className='error'>{error}</p>}
        {message && <p className='message'>{message}</p>}
        {loading && <Loading />}
      </div>
    </div>
  );
};

export default Account;
