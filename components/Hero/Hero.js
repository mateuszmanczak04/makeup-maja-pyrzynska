import Carousel from '../Carousel/Carousel';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.container} id='hero'>
      <h1>MAKE-UP MAJA PYRZYŃSKA</h1>
      <Carousel />
    </section>
  );
}
