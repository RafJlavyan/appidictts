import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Mail.ru",
  auth: {
    user: "jlavyan2021@mail.ru",
    pass: "0UacdL9tWBLND8wJxxD0",
  },
});


