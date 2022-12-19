import Image from 'next/image';
import React, { useState } from 'react';
import styles from './Carousel.module.scss';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { images as slides } from './data';

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || length <= 0) {
    return null;
  }

  const getPrev = () => {
    if (current === 0) {
      return length - 1;
    }
    return current - 1;
  };

  const getNext = () => {
    if (current === length - 1) {
      return 0;
    }
    return current + 1;
  };

  return (
    <div className={styles.container}>
      <AiOutlineArrowLeft
        className={styles.icon}
        style={{ left: '-24px' }}
        onClick={prevSlide}
      />
      {slides &&
        slides.map((slide, index) => {
          let className = 'hidden';
          if (getPrev() === index) {
            className = 'first';
          } else if (getNext() === index) {
            className = 'third';
          } else if (current === index) {
            className = 'main';
          }

          return (
            <div
              key={index}
              className={`${styles.imgContainer} ${styles[className]}`}
              onClick={() => {
                setCurrent(index);
              }}>
              <Image src={slide.image} width='400' height='600' alt='makijaż' />
            </div>
          );
        })}
      <AiOutlineArrowRight
        className={styles.icon}
        style={{ right: '-24px' }}
        onClick={nextSlide}
      />
    </div>
  );
};

export default Carousel;
