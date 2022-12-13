import React, { useState } from 'react';
import styles from './Rating.module.scss';
import { FaStar } from 'react-icons/fa';

const Rating = ({ setRating, rating }) => {
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);

  const handleClick = (value) => {
    setRating(value);
    setRating(value);
  };

  const handleMouseOver = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  return (
    <div className={styles.container}>
      {stars.map((_, index) => {
        return (
          <FaStar
            key={index}
            onClick={setRating && (() => handleClick(index + 1))}
            fill={(hoverValue || rating) > index ? 'var(--primary)' : 'grey'}
            onMouseOver={setRating && (() => handleMouseOver(index + 1))}
            onMouseLeave={setRating && handleMouseLeave}
            className={setRating && styles.changeable}
          />
        );
      })}
    </div>
  );
};

export default Rating;
