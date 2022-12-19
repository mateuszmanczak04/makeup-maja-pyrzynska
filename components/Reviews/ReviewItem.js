import React, { createRef, useEffect, useRef, useState } from 'react';
import Rating from '../Rating/Rating';
import styles from './ReviewItem.module.scss';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';

const ReviewItem = ({ review, removeReview }) => {
  const [isMine, setIsMine] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = createRef();
  const id = uuidv4();

  useEffect(() => {
    const getToKnowIfIsMine = async () => {
      const res = await fetch(
        process.env.BASE_URL + `/api/reviews/is-mine/${review._id}`,
        {
          method: 'GET',
        }
      );

      if (res.ok) {
        const json = await res.json();

        setIsMine(json.isMine);
      }
    };

    getToKnowIfIsMine();

    const clickEventHandler = (e) => {
      if (
        document.getElementById(id) &&
        !document.getElementById(id).contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('click', clickEventHandler);

    return () => {
      window.removeEventListener('click', clickEventHandler);
    };
  }, [review._id, id]);

  const handleDelete = async () => {
    const res = await fetch(process.env.BASE_URL + '/api/reviews', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewId: review._id }),
    });

    if (res.ok) {
      removeReview(review._id);
    }
  };

  const convertedTime = () => {
    let newDate = new Date(review.date);
    return newDate.toLocaleDateString('pl');
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h5 className={styles.author}>{review.author}</h5>
        {isMine && (
          <h5
            id={id}
            className={styles.menuButton}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}>
            <BiDotsVerticalRounded />

            <ul className={`${styles.menu} ${isMenuOpen && styles.open}`}>
              <li onClick={handleDelete}>Usuń</li>
            </ul>
          </h5>
        )}
      </div>
      <div className={styles.rating}>
        <Rating rating={review.rating} />
      </div>
      <p className={styles.description}>{review.description}</p>
      <p className={`sm ${styles.date}`}>{convertedTime()}</p>
    </div>
  );
};

export default ReviewItem;
