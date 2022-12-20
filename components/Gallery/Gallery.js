import React, { useState } from 'react';
import styles from './Gallery.module.scss';
import { images } from '../Carousel//data';
import Image from 'next/image';
import ModalImage from './ModalImage';
import { BiBody } from 'react-icons/bi';

const Gallery = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImagePosition, setCurrentImagePosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div className={styles.container}>
      <h2>Galeria</h2>
      <div className={styles.images}>
        {images.map((image) => {
          return (
            <Image
              key={image.image}
              width={300}
              height={400}
              alt='zdjęcie makijażu'
              src={image.image}
              className={styles.image}
              onClick={(e) => {
                setCurrentImagePosition({
                  x:
                    e.target.offsetLeft +
                    e.clientX -
                    e.pageX +
                    e.target.width / 2,
                  y:
                    e.target.offsetTop +
                    e.clientY -
                    e.pageY +
                    e.target.height / 2,
                });
                setCurrentImage(image.image);
              }}
            />
          );
        })}
      </div>
      {currentImage && (
        <ModalImage
          position={currentImagePosition}
          src={currentImage}
          close={() => setCurrentImage('')}
        />
      )}
    </div>
  );
};

export default Gallery;
