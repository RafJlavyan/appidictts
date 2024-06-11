import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../middlewares/passwordHash";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { transporter } from "../utils/emailTransporter";
import { validateReg } from "../middlewares/authValidator";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../utils/generateToken";

let refreshTokens: string[] = [];

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, isAdmin, credits } = req.body;

    const { error, value } = validateReg(req.body);
    if (error) {
      console.log(error);
      res.status(400).send(error.details);
      return;
    }

    const exist = await User.findOne({ email });
    if (exist) {
      res.json({
        error: "Email already exists",
      });
      return;
    }
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin,
      credits,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Make sure to set this environment variable
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    try {
      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

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

      res.json({
        userId: newUser._id,
        username: newUser.username,
        credits: newUser.credits,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        error: "user does not exist",
      });
      return;
    }

    if (!user.password) {
      res.json({
        error: "user password is not set",
      });
      return;
    }

    // check if password is correct
    const isMatch = await comparePassword(password, user.password);
    if (isMatch) {
      // generate an access token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      // Set authentication cookie
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

      res.json({
        userId: user._id,
        username: user.username,
        credits: user.credits,
      });
    } else {
      res.json({
        error: "incorrect password",
      });
      return;
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = (req: Request, res: Response): void => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) res.status(401).json("Refresh token not provided");

  // Assuming refreshTokens is declared elsewhere in your code
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json("Refresh token is not valid or expired");
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_JWT_SECRET!,
    (err: VerifyErrors | null, user: any) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Assuming refreshTokens is declared elsewhere in your code
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      // Assuming refreshTokens is declared elsewhere in your code
      refreshTokens.push(newRefreshToken);

      res.cookie("accessToken", newAccessToken, { httpOnly: true });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

export function logout(req: Request, res: Response): void {
  res.clearCookie("accessToken", {
    sameSite: "none",
    secure: true,
  });
  res.clearCookie("refreshToken", {
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
}

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        error: "user does not exist",
      });
      return;
    }
    const resetToken = generateResetToken(user);
    const link = `${process.env.SERVER_URL}/api/auth/send-reset-password/${user.id}/${resetToken}`;

    let mailOptions = {
      from: "jlavyan2021@mail.ru",
      to: "rawiy92601@jzexport.com",
      subject: "Password Reset",
      html: `
        <p>Hello ${user.username},</p>
        <p>We have received a request to reset your password. Please click the link below to reset your password:</p>
        <a href="${link}">Reset Password</a>
        <p>If you did not request this password reset, you can safely ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to send reset email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ message: "Reset email sent successfully" });
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendResetPasswordForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, token } = req.params;
  console.log(req.params);

  const user = await User.findOne({ _id: id });
  if (!user) {
    res.json(user);
    return;
  }

  try {
    const verify: any = jwt.verify(
      token,
      process.env.RESET_JWT_SECRET as string
    );
    const errors: any = {};
    res.render("resetPassword", { email: verify.email, errors });
  } catch (error) {
    res.send("Not verified");
  }
};

export const confirmResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ _id: id });
  if (!user) {
    res.json(user);
    return;
  }

  try {
    const verify: any = jwt.verify(
      token,
      process.env.RESET_JWT_SECRET as string
    );
    const hashedPassword = await hashPassword(password);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: { password: hashedPassword },
      }
    );
    res.render(`passwordChanged`, {});
  } catch (error) {
    res.send("Not verified");
  }
};
