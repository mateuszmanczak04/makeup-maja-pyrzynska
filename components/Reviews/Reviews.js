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

      console.log(json.message);
      setReviews(json.reviews);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  return (
    <div className={styles.container} id='reviews'>
      <h2>Opinie</h2>
      {!loading && <ReviewList reviews={reviews} />}
      {loading && <Loading />}
      {session && <AddReviewForm setReviews={setReviews} reviews={reviews} />}
    </div>
  );
};

export default Reviews;
