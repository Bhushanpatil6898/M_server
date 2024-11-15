
import { clientModel, otpmodel } from '../../schemas/index.js';
import dotenv from 'dotenv';
import {  uploadprofile } from '../../middleware/multer/index.js';
import { createToken } from '../../middleware/jwt/index.js';
dotenv.config();

export const registetration = async (req, res) => {

  const { firstName, lastName, mobileNumber, email, password, city, state, country } = req.body;

  try {
    const existingCustomer = await clientModel.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }]
    });

    if (existingCustomer) {
      return res.status(401).json({ message: "Email or mobile number already exists" });
    }
    const customer = await new clientModel({
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      state,
      country,
      city,
    });
    await customer.save();
    return res.status(200).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    if (otp) {
      const otpRecord = await otpmodel.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
      const user = await clientModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
    
      await otpmodel.deleteOne({ email, otp });
      return res.status(200).json({ message: 'Login successful with OTP!', user });
    }

    const user = await clientModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const accessToken = createToken(user);
   
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
      httpOnly: true,  // Prevent client-side access to cookies
      sameSite: 'None',  // Allow cookies across different domains
      secure: process.env.NODE_ENV === 'production',  // Cookies should only be sent over HTTPS in production
    //   domain: '.mahaluxmi-hardwear.netlify.app',
    };
    
    // Log cookieOptions to verify the configuration
    console.log("Cookie options:", cookieOptions);
    
    // Set cookies
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('role', user.role, cookieOptions);
   

    return res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const logout = async (req, res, next) => {
  try {
    // Clear token and role cookies
   res.clearCookie('token', { 
      httpOnly: true, 
      sameSite: 'None', 
      secure: process.env.NODE_ENV === 'production',  // Use 'true' for production environment
    
    });

    res.clearCookie('role', { 
      httpOnly: true, 
      sameSite: 'None', 
      secure: process.env.NODE_ENV === 'production', 
    
    });

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    return next(createError(500, "An error occurred while logging out"))
  }
}

export const Profile = async (req, res) => {

  const { id } = req.user;
  try {
    const user = await clientModel.findById(id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    return res.status(200).json({
      message: 'User data',
      user
    });
  } catch (error) {
    console.error('Error during data retrieval:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateProfile = async (req, res) => {
    uploadprofile(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: "Image upload failed. " + err.message });
      }
  
      const { id } = req.user;
      const { firstName, lastName, email, mobileNumber, city, state, country } = req.body;
  
      try {
        const user = await clientModel.findById(id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.mobileNumber = mobileNumber || user.mobileNumber;
        user.city = city || user.city;
        user.state = state || user.state;
        user.country = country || user.country;
  
        if (req.file) {
          user.profileImage = req.file.path;
        } else if (!req.file && req.body.profileImageUpdate) {
          return res.status(400).json({ message: "No image file provided for upload." });
        }
  
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
    });
  };

export const updatepassword = async (req, res) => {
  try {
    const { id } = req.user; // Assuming req.user is populated by authentication middleware
    const { password } = req.body;

    // Fetch user from the database
    const user = await clientModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new password is the same as the current password
    if (user.password === password) {
      return res.status(400).json({ message: "New password and old password are the same" });
    }

    // Update the password
    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

