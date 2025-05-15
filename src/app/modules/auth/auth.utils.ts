import jwt, { JwtPayload } from 'jsonwebtoken';

type IJwtPayload = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
};

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(
    jwtPayload,
    secret as jwt.Secret,
    {
      expiresIn: expiresIn as string,
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
