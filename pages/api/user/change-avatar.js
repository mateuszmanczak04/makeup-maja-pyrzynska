import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Metoda niedozwolona.' });
  }

  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ message: 'Brak zdjęcia.' });
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

    await db
      .collection('users')
      .updateOne({ email }, { $set: { avatar: imagePath } });

    return res
      .status(200)
      .json({ message: 'Pomyślnie zmieniono zdjęcie profilowe.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Błąd serwera.' });
  }
}
