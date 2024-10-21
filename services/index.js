
 import  BillModel, {  clientModel, productModel } from './../schemas/index.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { uploadImage, uploadprofile } from '../middleware/multer/index.js';
import { createToken } from '../middleware/jwt/index.js';
import jwt from 'jsonwebtoken';
dotenv.config();

export const server = (req, res) => {
  
  res.status(200).send('Server is alive and working!');
 
};


export const registetration = async (req, res) => {

   const { firstName, lastName, mobileNumber, email, password,city,state,country } = req.body;

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
  const { email, password } = req.body;

  try {
      // Find user by email
      const user = await clientModel.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }
     

      // Direct password comparison
      if (password !== user.password) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }
      // console.log('Password matched successfully');

      // // Generate token (log token creation)
      // const accessToken = createToken(user);
      // console.log('Token generated successfully:', accessToken);

      // // Set cookies
      // res.cookie('token', accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      // res.cookie('role', user.role, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      // console.log('Cookies set successfully');

      return res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};


export const logout = async (req, res, next) => {
  try {
      // Clear token and role cookies
      res.clearCookie('token');
      res.clearCookie('role');

      // Optionally, you can send a logout message or redirect the user to a different page
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



export const addProduct = async (req, res) => {
  

  uploadImage(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, description, price, stock, category, brand, sku} = req.body;
    
    try {
      // Check for existing product by SKU
      const existingProduct = await productModel.findOne({ sku });

      if (existingProduct) {
        return res.status(401).json({ message: "Product with this SKU already exists" });
      }

      const imageUrl = req.file ? `/mahaluxmi_hardware/${req.file.filename}` : null;

      const product = new productModel({
        name,
        description,
        price,
        stock,
        category,
        brand,
        sku,
        imageUrl: imageUrl, // Store the MIME type of the image
      });

      // Save the product to the database
      await product.save();

      return res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
      console.error('Error during product creation:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

export const GetProduct = async (req, res) => {
  try {
    const product = await productModel.find();
    
    if (!product) {
      return res.status(401).json({ message: 'product not found' });
    }
    return res.status(200).json({
      message: 'Product data',
      product
    });
  } catch (error) {
    console.error('Error during data retrieval:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const deleteProduct = async (req, res) => {
 
  try {
    // Find and delete the product by ID
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createBill = async (req, res) => {
  try {
    const { customerName, contactNumber, address, productList, totalAmount } = req.body
    const formattedProductList = productList.map(product => ({
      productName: product.productName,
      quantity: Number(product.quantity), 
      price: Number(product.price) 
    }));

    // Create a new Bill object
    const newBill = new BillModel({
      customerName,
      contactNumber,
      address,
      productList: formattedProductList, 
      totalAmount: Number(totalAmount) 
    });
    await newBill.save();

    // Return success response
    res.status(200).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error); // Log error for debugging
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
};
export const deleteBills = async (req, res) => {

 
  try {
    // Find and delete the product by ID
    const deletedProduct = await BillModel.findByIdAndDelete(billId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllBills = async (req, res) => {
  
  try {
    const bills = await BillModel.find();
    res.status(200).json({ message: 'Bills retrieved successfully', bills });
  } catch (error) {
    console.error('Error retrieving bills:', error); // Log error for debugging
    res.status(500).json({ message: 'Error retrieving bills', error: error.message });
  }
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
export const updateProfile = async (req, res) => {
  // Use the image upload middleware to handle the profile image upload
  uploadprofile(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.user; 
    const { firstName, lastName, email, mobileNumber, city, state, country } = req.body;


    try {
      // Fetch user from the database
      const user = await clientModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user information
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.mobileNumber = mobileNumber || user.mobileNumber;
      user.city = city || user.city;
      user.state = state || user.state;
      user.country = country || user.country;
      user.password=user.password;

     
      if (req.file) {
        user.profileImage = req.file.path; 
      }

      // Save the updated user
      await user.save();

      return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
};
