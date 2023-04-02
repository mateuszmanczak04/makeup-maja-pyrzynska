import { useEffect } from 'react';
import styles from './Contact.module.scss';

export default function Contact() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animated);
        }
      });
    });

    observer.observe(document.getElementById('contact'));
  }, []);

  return (
    <section className={styles.container} id='contact'>
      <h2>Kontakt</h2>
      <p>
        <a href='https://www.facebook.com/maja.pyrzynska.7' target='blank'>
          https://www.facebook.com/maja.pyrzynska.7
        </a>
      </p>
    </section>
  );
}
