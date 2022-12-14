import React from 'react';
import ReviewItem from './ReviewItem';
import styles from './ReviewList.module.scss';

const ReviewList = ({ reviews, removeReview }) => {
  if (!reviews || reviews.length === 0) {
    return <h4>Nie ma jeszcze żadnych opini</h4>;
  }

  return (
    <div className={styles.container}>
      {reviews &&
        reviews.map((review) => (
          <ReviewItem
            key={review._id}
            review={review}
            removeReview={removeReview}
          />
        ))}
    </div>
  );
};

export default ReviewList;
