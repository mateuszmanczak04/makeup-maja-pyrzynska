import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { connectToDatabase } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Dozwolona metoda to POST' });
  }
  try {
    let email;

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      email = token.email;
    } else {
      email = req.body.email;
    }

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
        <div style='display: flex; flex-direction: column; gap: 16px; align-items: center; width: 100%; max-width: 600px; background: #f69b98; padding: 24px; border-radius: 16px; margin: auto;' >
          <h1 style='font-size: 24px; text-align: center; color: #ffffff;'>
            Wchodząc w poniższy link, potwierdzasz rejestrację na stronie Makeup Maja Pyrzyńska:
          </h1>
          <a href='${process.env.BASE_URL}/api/verify/${emailVerifyHash}' style='color: rgb(19, 113, 219); font-size: 18px;'>
            Kliknij tutaj
          </a>
        </div>
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
