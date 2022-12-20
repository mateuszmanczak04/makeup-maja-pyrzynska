import Image from 'next/image';
import React, { createRef, useEffect, useRef } from 'react';
import styles from './ModalImage.module.scss';

const ModalImage = ({ src, close, position }) => {
  useEffect(() => {
    const image = document.getElementById('imageModal');
    const backdrop = document.getElementById('imageModalBackdrop');

    image.classList.add(styles.image);
    backdrop.classList.add(styles.backdrop);

    image.style.left = position.x.toString() + 'px';
    image.style.top = position.y.toString() + 'px';
    image.style.transform = 'none';
    image.style.width = '300px';
    image.style.height = '400px';
    image.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
      image.classList.add(styles.open);
      backdrop.classList.add(styles.open);

      image.style.transition = '0.3s';
      image.style.left = '50%';
      image.style.top = '50%';
      image.style.transform = 'translate(-50%, -50%)';

      if (window.innerWidth * 1.33 > window.innerHeight) {
        image.style.height = '100vh';
        image.style.width = '75vh';
      } else {
        image.style.width = '100vw';
        image.style.height = '133.3vw';
      }
    }, 0);
  });

  const handleClose = () => {
    const image = document.getElementById('imageModal');
    const backdrop = document.getElementById('imageModalBackdrop');

    backdrop.classList.remove(styles.open);
    image.style.width = '300px';
    image.style.height = '400px';
    image.style.transform = 'translate(-50%, -50%)';
    image.style.left = position.x.toString() + 'px';
    image.style.top = position.y.toString() + 'px';

    setTimeout(() => {
      close();
    }, 300);
  };

  return (
    <div className={styles.container} onClick={handleClose}>
      <Image
        alt='zdjęcie makijażu'
        src={src}
        width={900}
        height={1200}
        // className={`${styles.image}`}
        id='imageModal'
      />

      <div className={`${styles.backdrop}`} id='imageModalBackdrop'></div>
    </div>
  );
};

export default ModalImage;
