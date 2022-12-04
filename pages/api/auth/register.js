import { hashPassword, validateEmail } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Upewnij się, że podałeś wszystkie potrzebne informacje.',
    });
  }

  if (!(await validateEmail(email))) {
    return res.status(400).json({ message: 'Niepoprawny e-mail.' });
  }

  const client = await connectToDatabase();

  const db = client.db();

  const existingUser = await db
    .collection('users')
    .findOne({ email: email.toLowerCase() });

  console.log(email.toLowerCase());

  if (existingUser) {
    client.close();
    return res
      .status(400)
      .json({ message: 'Użytkownik o takim e-mailu już istnieje.' });
  }

  const hashedPassword = await hashPassword(password);

  await db.collection('users').insertOne({
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  client.close();
  res.status(201).json({ message: 'Pomyślnie zarejestrowano.' });
}

export default handler;
