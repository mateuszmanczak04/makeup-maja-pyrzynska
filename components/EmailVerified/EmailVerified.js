import React from 'react';
import styles from './EmailVerified.module.scss';

const EmailVerified = ({ verified, email }) => {
  return (
    <div className={styles.container}>
      {verified ? (
        <div className={styles.verified}>
          <h3>E-mail zweryfikowany</h3>
          <p>{email}</p>
        </div>
      ) : (
        <div className={styles.unverified}>
          <h3>Nie udało się zweryfikować e-maila</h3>
        </div>
      )}
    </div>
  );
};

export default EmailVerified;
