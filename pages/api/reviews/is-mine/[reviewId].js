import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Niedozwolona metoda.' });
  }

  try {
    const reviewId = req.query.reviewId;

    if (!reviewId) {
      return res.status(400).json({ message: 'Niepoprawna opinia.' });
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return res.status(400).json({ message: 'Brakujący token' });
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
      return res.status(200).json({ isMine: false });
    }

    return res.status(200).json({ isMine: true });
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
}
