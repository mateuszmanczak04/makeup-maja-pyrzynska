import { hashPassword, validateEmail } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: 'Upewnij się, że podałeś wszystkie potrzebne informacje.',
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Minimalna długość hasła to 6 znaków.' });
    }

    if (!(await validateEmail(email))) {
      return res.status(400).json({ message: 'Niepoprawny e-mail.' });
    }

    const client = await connectToDatabase();

    const db = client.db();

    const existingUser = await db
      .collection('users')
      .findOne({ email: email.toLowerCase() });

    if (existingUser) {
      client.close();
      return res
        .status(400)
        .json({ message: 'Użytkownik o takim e-mailu już istnieje.' });
    }

    const hashedPassword = await hashPassword(password);

    await db.collection('users').insertOne({
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      emailVerified: false,
    });

    await fetch(process.env.BASE_URL + '/api/auth/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    client.close();
    res.status(201).json({ message: 'Pomyślnie zarejestrowano.' });
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera' });
  }
}

export default handler;
