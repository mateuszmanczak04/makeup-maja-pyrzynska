import { useEffect } from 'react';
import styles from './AboutMe.module.scss';

export default function AboutMe() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animated);
        }
      });
    });

    observer.observe(document.getElementById('aboutMeParagraph'));
  }, []);

  return (
    <section className={styles.container} id='aboutMe'>
      <article id='aboutMeParagraph'>
        <h2>Kilka słów o mnie...</h2>
        <p>
          Nazywam się Maja Pyrzyńska i mam 17 lat. Uczęszczam do 3 klasy liceum.
          Odkąd pamiętam zawsze bardzo interesowało mnie malowanie - wtedy
          jeszcze na kartkach. Po paru latach stwierdziłam, że moja twarz może
          być moją kartką i równie dobrze mogę malować na buźce. Metodą prób i
          błędów oraz oglądaniu wielu filmików, zdobyłam wiedzę na temat
          makijażu. Oczywiście nadal się kształcę w tym kierunku, uczęszczam
          regularnie na kursy, szkolenia itp. Łapie się wszystkiego, co mogłoby
          jeszcze bardziej poszerzyć moją wiedzę i umiejętności. Malowanie jest
          dla mnie pewną formą odstresowania. Gdy maluje zapominam o wszystkim i
          oddaje się temu, co właśnie pojawia się na mojej twarzy. Zajmowanie
          się makijażem to nie tylko jedyne moje hobby. Kocham również gotować i
          zajmować się paznokciami. Jestem bardzo spokojną osobą, która
          większość czasu spędza w zaciszu domowym przy książkach. Uwielbiam też
          koty, są naprawdę kochanymi zwierzakami! Myślę, że to tyle o mnie.
          Zapraszam do obejrzenia kilku makijaży w moim wykonaniu, mam nadzieje,
          że trafię w Twój gust.
        </p>
      </article>
    </section>
  );
}
