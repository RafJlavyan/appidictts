import { Request, Response } from "express";
import passport from "passport";
import User, { UserType } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

let refreshTokens: string[] = [];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `/api/oauth/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        let userEmail: string | undefined;
        if (profile.emails && profile.emails.length > 0) {
          userEmail = profile.emails[0].value;
        } else {
          userEmail = undefined;
        }

        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: userEmail,
          });
        }
        await user.save();

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        return done(null, {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

export const handleGoogleCallback = (req: Request, res: Response) => {
  passport.authenticate("google", { failureRedirect: "/login/failed" })(
    req,
    res,
    () => {
      const { user, accessToken, refreshToken } = req.user as {
        user: UserType;
        accessToken: string;
        refreshToken: string;
      };

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.redirect(`${process.env.CLIENT_URL}/home`);
    }
  );
};

export const handleFailedLogin = (req: Request, res: Response) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.user as { email: string };
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    res.status(200).json({
      userId: user._id,
      username: user.username,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
