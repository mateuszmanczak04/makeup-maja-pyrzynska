import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword, hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(400)
      .json({ message: 'Obsługiwana prośba to tylko POST.' });
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

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
      return res.status(400).json({ message: 'Podaj stare hasło.' });
    }

    if (!newPassword) {
      return res.status(400).json({ message: 'Podaj nowe hasło.' });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Niepoprawny e-mail.' });
    }

    const match = await verifyPassword(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Niepoprawne stare hasło.' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'Twoje hasło musi mieć co najmniej 6 znaków.' });
    }

    const newHashedPassword = await hashPassword(newPassword);

    await db
      .collection('users')
      .updateOne({ email }, { $set: { password: newHashedPassword } });

    return res.status(200).json({ message: 'Hasło zmienione.' });
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
}
