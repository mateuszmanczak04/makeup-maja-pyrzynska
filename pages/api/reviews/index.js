import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return res
          .status(400)
          .json({ message: 'Aby to zrobić, musisz podać token.' });
      }

      const { rating, description } = req.body;
      const authorEmail = token.email;

      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: 'Ocena może być tylko w skali od 1 do 5.' });
      }

      const client = await connectToDatabase();
      const db = client.db();

      const author = await db
        .collection('users')
        .findOne({ email: authorEmail });

      const authorId = author._id;

      if (!author || !rating) {
        return res.status(400).json({ message: 'Brakuje oceny lub autora.' });
      }

      const existingReview = await db
        .collection('reviews')
        .findOne({ author: authorId });

      if (existingReview) {
        return res.status(400).json({
          message:
            'Już opublikowałeś(aś) opinię. Usuń poprzednią, aby dodać kolejną.',
        });
      }

      const date = Date.now();

      const reviewId = (
        await db
          .collection('reviews')
          .insertOne({ author: authorId, rating, description, date })
      ).insertedId;
      const review = await db.collection('reviews').findOne({ _id: reviewId });

      const reviewToReturn = review;
      reviewToReturn.author = author.username;

      return res.status(200).json({ review: reviewToReturn });
    } else if (req.method === 'GET') {
      const client = await connectToDatabase();
      const db = client.db();

      const reviews = await db.collection('reviews').find().toArray();

      const reviewsToReturn = await Promise.all(
        reviews.map(async (review) => {
          const authorId = review.author;
          const author = await db
            .collection('users')
            .findOne({ _id: authorId }, { username: 1 });

          return { ...review, author: author.username };
        })
      );

      return res.status(200).json({ reviews: reviewsToReturn });
    } else if (req.method === 'DELETE') {
      const { reviewId } = req.body;
      if (!reviewId) {
        return res.status(400).json({ message: 'Niepoprawna opinia.' });
      }

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return res
          .status(400)
          .json({ message: 'Aby to zrobić, musisz podać token.' });
      }

      const email = token.email;

      const client = await connectToDatabase();
      const db = client.db();

      const review = await db
        .collection('reviews')
        .findOne({ _id: new ObjectId(reviewId) });

      if (!review) {
        return res.status(400).json({ message: 'Niepoprawna opinia.' });
      }

      const author = await db
        .collection('users')
        .findOne({ email }, { _id: true });
      const authorId = author._id;

      if (review.author.toString() !== authorId.toString()) {
        return res
          .status(400)
          .json({ message: 'Nie możesz usunąć czyjejś opini.' });
      }

      await db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });

      return res.status(200).json({ message: 'Usunięto opinię.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
}
