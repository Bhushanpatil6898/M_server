
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
 import { sender } from '../../middleware/email/email.sender.js';
import createOtp from 'otp-generator'
import { clientModel,otpmodel  } from '../../schemas/index.js';
dotenv.config();

export const server = (req, res) => {

  res.status(200).send('Server is alive and working!');
 
};

export const genrateotp = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await clientModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Generate OTP
    const otp = createOtp.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true
    });

    // Save OTP in the database
    const sendotp = await otpmodel({
      email,
      otp,
      created_at: new Date(Date.now())
    });
    sendotp.save();

    // Send email with the OTP
    sender.sendMail({
      from: "patil.bhushan6898@gmail.com",
      to: email,
      subject: "Your OTP Verification Code from Mahaluxmi Hardware",
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #c6c7c8;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(90deg, #FF8C00, #FF3D00);
            color: white;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        .otp {
            font-size: 30px;
            font-weight: bold;
            color: #FF4500;
            background-color: #FFF5EE;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            border: 2px solid #FF4500; /* Optional border for emphasis */
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            color: #ffffff;
            background-color: #FF4500;
            border-radius: 8px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            margin-top: 20px;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        a {
            color: #FF4500;
            text-decoration: none;
        }
        .footer a {
            color: #FF4500;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Welcome to Mahaluxmi Hardware</div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to verify your email. Please use the OTP below to complete your verification:</p>
            <div class="otp">${otp}</div>
            <p>If you didn’t request this verification, feel free to ignore this email or contact our support team.</p>
            <a href="https://mahaluxmihardware.com" class="button">Visit Our Website</a>
            <p>Thank you for choosing Mahaluxmi Hardware!</p>
        </div>
        <div class="footer">
            <p>Mahaluxmi Hardware, Post Kalmadu, Tal. Chalisgaon, Dist. Jalgaon</p>
            <p>Need help? <a href="mailto:support@mahaluxmihardware.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>

      `,
    });

    return res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error during OTP generation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllUsers = async (req, res) => {


    try {
      const users = await clientModel.find();
      res.status(200).json({ message: 'User retrieved successfully', users });
    } catch (error) {
      console.error('Error retrieving Users:', error); // Log error for debugging
      res.status(500).json({ message: 'Error retrieving Users', error: error.message });
    }
  };

export const verification = (req, res, next) => {
  const cookies = req.cookies;
  const { token, role } = cookies;

  // Check if token and role exist
  if (!token || !role) {
    return res.status(401).json({ message: 'User not authorized. Token or role is missing.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid.' });
    }

    // Attach user details to req object
    req.user = decodedUser;
    const { id } = decodedUser;

    // Return successful response with user id and role
    return res.status(200).json({ id, role });
  });
};

