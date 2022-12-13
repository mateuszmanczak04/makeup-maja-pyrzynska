import { hashPassword, validateEmail } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default async function newPassword(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  try {
    const { email, token, password } = req.body;

    if (!email || !password || !token) {
      return res.status(400).json({
        message: 'Upewnij się, że podałeś wszystkie potrzebne informacje.',
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Minimalna długość hasła to 6 znaków.' });
    }

    const client = await connectToDatabase();

    const db = client.db();

    const existingUser = await db
      .collection('users')
      .findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      client.close();
      return res.status(400).json({ message: 'Niepoprawny e-mail.' });
    }

    const hashedPassword = await hashPassword(password);

    await db
      .collection('users')
      .updateOne({ email }, { $set: { password: hashedPassword } });

    client.close();
    res.status(201).json({ message: 'Pomyślnie zmieniono hasło.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
}
