import React from 'react';
import jwt from 'jsonwebtoken';
import EmailVerified from '../../components/EmailVerified/EmailVerified';

const emailZweryfikowany = ({ verified, email }) => {
  return <EmailVerified verified={verified} email={email} />;
};

export default emailZweryfikowany;

export async function getServerSideProps(context) {
  if (!context?.query?.token) {
    return {
      props: {
        verified: false,
      },
    };
  }

  return await jwt.verify(
    context.query.token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err || !decoded) {
        return {
          props: {
            verified: false,
          },
        };
      }

      return {
        props: {
          verified: true,
          email: decoded.email,
        },
      };
    }
  );
}
