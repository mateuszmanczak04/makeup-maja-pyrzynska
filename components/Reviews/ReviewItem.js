import React from 'react';
import Rating from '../Rating/Rating';
import styles from './ReviewItem.module.scss';

const ReviewItem = ({ review }) => {
  return (
    <div className={styles.container}>
      <h5 className={styles.author}>{review.author}</h5>
      <Rating rating={review.rating} />
      <p className={styles.description}>{review.description}</p>
    </div>
  );
};

export default ReviewItem;
