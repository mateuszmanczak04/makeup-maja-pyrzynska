import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Obsługiwane prośby to POST' });
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

    const { newUsername } = req.body;

    if (!newUsername) {
      return res
        .status(400)
        .json({ message: 'Nie możesz ustawić pustej nazwy użytkownika.' });
    }

    const client = await connectToDatabase();
    const db = client.db();

    await db
      .collection('users')
      .updateOne({ email }, { $set: { username: newUsername } });

    return res.status(200).json({ message: 'Nazwa użytkownika zmieniona.' });
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
}
