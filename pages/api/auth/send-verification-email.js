import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { connectToDatabase } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Dozwolona metoda to POST' });
  }
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Brakuje e-maila.' });
    }

    const client = await connectToDatabase();
    const db = await client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Nie istnieje konto o podanym e-mailu.' });
    }

    if (!user.emailVerified) {
      return res
        .status(400)
        .json({
          message:
            'Nie możemy przywrócić hasła użytkownikowi, który nie potwierdził jeszcze swojego e-maila.',
        });
    }

    var emailVerifyHash = await jwt.sign({ email }, process.env.JWT_SECRET);

    // await db
    //   .collection('users')
    //   .update({ email }, { $set: { emailVerifyHash } });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    transporter.sendMail(
      {
        from: 'Makeup Maja Pyrzyńska',
        to: email,
        subject: 'Potwierdzenie rejestracji',
        text: `Wchodząc w poniższy link, potwierdzasz rejestrację na stronie ${process.env.BASE_URL}`,
        html: `
        <h1>
          Wchodząc w poniższy link, potwierdzasz rejestrację na stronie ${process.env.BASE_URL}:
        </h1>
        <a href='${process.env.BASE_URL}/api/verify/${emailVerifyHash}'>
          Kliknij tutaj
        </a>
      `,
      },
      function (err, info) {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Wystąpił błąd poczas wysyłania e-maila.' });
        }
        return res.status(200).json({ message: 'Wiadomość została wysłana.' });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera' });
  }
}
