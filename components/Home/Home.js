import Head from 'next/head';
import AboutMe from '../AboutMe/AboutMe';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';
import Hero from '../Hero/Hero';
import Reviews from '../Reviews/Reviews';
import styles from './Home.module.scss';

export default function Home({ reviews }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>MAKE-UP MAJA PYRZYŃSKA</title>
        <meta name='description' content='Informacje dotyczące makijażu.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Hero />
      <AboutMe />
      <Reviews reviews={reviews} />
      <Contact />
      <Footer />
    </div>
  );
}
