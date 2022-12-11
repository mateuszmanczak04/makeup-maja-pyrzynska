import { connectToDatabase } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export default async function sendResetPasswordLink(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Podaj e-mail' });
    }

    const client = await connectToDatabase();
    const db = await client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Nie istnieje konto o podanym e-mailu.' });
    }

    var resetPasswordHash = await jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

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

    return transporter.sendMail(
      {
        from: 'Makeup Maja Pyrzyńska',
        to: email,
        subject: 'Reset hasła',
        text: `Wchodząc w poniższy link, masz możliwość zresetowania swojego hasła na stronie ${process.env.BASE_URL}`,
        html: `
        <h1>
          Wchodząc w poniższy link, masz możliwość zresetowania swojego hasła na stronie ${process.env.BASE_URL}:
        </h1>
        <a href='${process.env.BASE_URL}/nowe-haslo/${resetPasswordHash}'>
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
        return res
          .status(200)
          .json({ message: 'Wiadomość została wysłana. Sprawdź skrzynkę.' });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
}
