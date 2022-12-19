import React, { useEffect, useState } from 'react';
import AddReviewForm from './AddReviewForm';
import ReviewList from './ReviewList';
import styles from './Reviews.module.scss';
import { useSession } from 'next-auth/react';
import Loading from '../Loading/Loading';

const Reviews = () => {
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(process.env.BASE_URL + '/api/reviews', {
        method: 'GET',
      });

      const json = await res.json();

      if (!res.ok) {
        return;
      }

      setReviews(json.reviews);
      setLoading(false);
    };

    const getToKnowIfMayAdd = async () => {
      const res = await fetch(process.env.BASE_URL + '/api/reviews/may-add', {
        method: 'GET',
      });

      const json = await res.json();

      if (res.ok) {
        setMayAdd(json.mayAdd);
      }
    };

    fetchReviews();
    getToKnowIfMayAdd();
  }, []);

  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [mayAdd, setMayAdd] = useState(false);

  const removeReview = (_id) => {
    setReviews((prev) => {
      return prev.filter((r) => r._id !== _id);
    });
    setMayAdd(true);
  };

  return (
    <div className={styles.container} id='reviews'>
      <h2>Opinie</h2>
      {!loading && reviews && (
        <ReviewList reviews={reviews} removeReview={removeReview} />
      )}
      {loading && <Loading />}
      {session && mayAdd && (
        <AddReviewForm
          setReviews={setReviews}
          reviews={reviews}
          setMayAdd={setMayAdd}
        />
      )}
    </div>
  );
};

export default Reviews;
