
 import  BillModel, {  clientModel, productModel } from './../schemas/index.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { uploadImage } from '../middleware/multer/index.js';
import { createToken } from '../middleware/jwt/index.js';
dotenv.config();



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

        // Check if the password matches using bcrypt
        if (password !== user.password) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const accessToken = createToken(user);
        res.cookie('token', accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie('role', user.role, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

        return res.status(200).json({ message: "Login successful!", user: user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

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
  const { token, role } = cookies
console.log(token, role);

  
 
}
 // 'image' is the field name for the uploaded file

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
  const { productId } = req.body;
 
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
  const { billId } = req.body;
 
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