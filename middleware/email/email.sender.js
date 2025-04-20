
import nodemailer from "nodemailer"


export const sender = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "patil.bhushan6898@gmail.com",
      pass: "lqsm soqp dfks pgfn",
    },
  });

  // export const sender = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 587,
  //   secure: false, // true for port 465, false for other ports
  //   auth: {
  //     user: "mahalaxmihardware.electric.2016@gmail.com",
  //     pass: " salv jwsi ontr cmrs",
  //   },
  // });
  
