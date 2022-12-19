import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res
      .status(400)
      .json({ message: 'Nie możesz wykonać tu innego zapytania, niż GET' });
  }
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return res
        .status(400)
        .json({ message: 'Niepoprawny lub nieaktualny token.' });
    }

    const client = await connectToDatabase();
    const db = await client.db();

    const user = await db.collection('users').findOne({ email: token.email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Szukany użytkownik nie istnieje w bazie danych.' });
    }

    let hasPassword = false;
    if (user.password) {
      hasPassword = true;
    }

    return res.status(200).json({
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      hasPassword,
      avatar: user.avatar,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
}
