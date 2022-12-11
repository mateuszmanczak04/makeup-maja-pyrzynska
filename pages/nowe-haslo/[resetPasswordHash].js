import NewPassword from '../../components/NewPassword/NewPassword';
import jwt from 'jsonwebtoken';

export default function NoweHaslo({ ableTo, email, token }) {
  return <NewPassword ableTo={ableTo} email={email} token={token} />;
}

export async function getServerSideProps(context) {
  if (!context?.query?.resetPasswordHash) {
    return {
      props: {
        ableTo: false,
      },
    };
  }

  return await jwt.verify(
    context.query.resetPasswordHash,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err || !decoded) {
        return {
          props: {
            ableTo: false,
          },
        };
      }

      return {
        props: {
          ableTo: true,
          email: decoded.email,
          token: context.query.resetPasswordHash,
        },
      };
    }
  );
}
