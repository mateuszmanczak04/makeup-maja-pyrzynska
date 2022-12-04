import Head from 'next/head';
import AboutMe from '../AboutMe/AboutMe';
import Carousel from '../Carousel/Carousel';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';
import Hero from '../Hero/Hero';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MAKE-UP MAJA PYRZYŃSKA</title>
        <meta name='description' content='Informacje dotyczące makijażu.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Hero />
      <AboutMe />
      <Contact />
      <Footer />
    </div>
  );
}
