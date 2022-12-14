import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  session: {
    strategy: 'jwt',
    magAge: 10 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('Nieprawidłowe dane logowania.');
        }

        // Gdy użytkownik jeset zarejestrowany przez inny provider bez hasła
        if (!user.password) {
          throw new Error('Nieprawidłowe dane logowania');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Nieprawidłowe dane logowania.');
        }

        client.close();

        return {
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/logowanie',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const client = await connectToDatabase();
        const db = client.db();

        const existsInDatabase = await db
          .collection('users')
          .findOne({ email: user.email });

        if (existsInDatabase) {
          return true;
        }

        const newUser = await db.collection('users').insertOne({
          email: user.email,
          username: user.name,
          avatar: '',
          emailVerified: true,
        });
        const newUserId = newUser._id;
        const newUserDoc = await db
          .collection('users')
          .findOne({ _id: newUserId });
      }
      return true;
    },
  },
});
