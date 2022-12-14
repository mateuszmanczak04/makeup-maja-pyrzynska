import React, { useState } from 'react';
import Rating from '../Rating/Rating';
import styles from './AddReviewForm.module.scss';
import { useSession } from 'next-auth/react';
import Loading from '../Loading/Loading';

const AddReviewForm = ({ setReviews, reviews }) => {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch(process.env.BASE_URL + '/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, description }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      setLoading(false);
      return;
    }

    setReviews([...reviews, json.review]);
    setLoading(false);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h5>Dodaj opinię</h5>
      <Rating rating={rating} setRating={setRating} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Podziel się tym, co myślisz'></textarea>
      <button>Wyślij</button>
      {loading && <Loading />}
      {error && <p className='error'>{error}</p>}
    </form>
  );
};

export default AddReviewForm;
