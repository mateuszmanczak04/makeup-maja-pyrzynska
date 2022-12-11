import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { emailVerifyHash } = req.query;

  if (!emailVerifyHash) {
    return res.status(400).json({ message: 'Musisz podać token' });
  }

  jwt.verify(emailVerifyHash, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded) {
      return res.status(400).json({ message: 'Niepoprawny token' });
    }

    const email = decoded.email;

    const client = await connectToDatabase();
    const db = await client.db();

    await db
      .collection('users')
      .update({ email }, { $set: { emailVerified: true } });

    // const token = await jwt.sign({ email }, process.env.JWT_SECRET);

    res.redirect(`/email-zweryfikowany/${emailVerifyHash}`);
  });
}
