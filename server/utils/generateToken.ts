import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const generateAccessToken = (user: User) => {
  return jwt.sign(
    {
      user: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.ACCESS_JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign(
    {
      user: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.REFRESH_JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const generateResetToken = (user: User) => {
  return jwt.sign(
    {
      user: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.RESET_JWT_SECRET as string,
    { expiresIn: "1h" } // Set expiration time for reset token
  );
};