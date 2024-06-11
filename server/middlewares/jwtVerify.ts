import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

// Define your verifyToken middleware
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authCookie = req.cookies.accessToken;
  if (authCookie) {
    const token = authCookie;
    jwt.verify(
      token,
      process.env.ACCESS_JWT_SECRET as string,
      (err: VerifyErrors | null, payload: any) => {
        if (err) {
          console.error("JWT verification error:", err);
          return res.status(401).json({ error: "Token is not valid" });
        }
        // Assuming payload contains user information
        payload.userId = payload.user;
        delete payload.user;
        // Assigning the user information to the request object
        // req.user = payload;
        next();
      }
    );
  } else {
    return res.status(401).json("You are not authenticated");
  }
};
