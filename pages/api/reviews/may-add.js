import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Niedozwolona metoda.' });
  }

  try {
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

    const user = await db.collection('users').findOne({ email }, { _id: 1 });
    const userId = user._id;

    const review = await db.collection('reviews').findOne({ author: userId });

    if (review) {
      return res.status(200).json({ mayAdd: false });
    }

    return res.status(200).json({ mayAdd: true });
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
}
