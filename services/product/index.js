
import logAction from '../../middleware/activity/index.js';
import { uploadImage } from '../../middleware/multer/index.js';
import  { clientModel, notificationModel, productModel } from '../../schemas/index.js';

export const addProduct = async (req, res) => {
  const { id } = req.user;
 
    
  
  uploadImage(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, description, price, stock, category, brand, sku } = req.body;

    try {
      // Check for existing product by SKU
      const existingProduct = await productModel.findOne({ sku });
      const user = await clientModel.findById(id);
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
      logAction(
        user._id,
        'ADD_PRODUCT',
        `Product added by ${user.firstName} ${user.lastName} (Email: ${user.email}). 
        Product Name: ${name}, Category: ${category}, Price: ₹${price}, Stock: ${stock}, SKU: ${sku}.`,
        req
     );
      const admin = await clientModel.findOne({ role: "admin" });
    if (admin) {
      const productNotification = new notificationModel({
        recipient: admin._id,
        type: "product",
        message: `New product added: ${name} (Category: ${category}, Price: ${price})`,
      });
      await productNotification.save();
    }
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
    const { productId } = req.body;

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const admin = await clientModel.findOne({ role: "admin" });
    if (admin) {
      const notification = new notificationModel({
        recipient: admin._id,
        type: "product",
        message: `Product deleted: ${deletedProduct.name} (Category: ${deletedProduct.category}, Price: ${deletedProduct.price})`,
      });
      await notification.save();
    }
    logAction(
      req.user._id,
      'DELETE_PRODUCT',
      `Product deleted by ${req.user.firstName} ${req.user.lastName} (Email: ${req.user.email}). 
       Product Name: ${deletedProduct.name}.`,
      req
    );
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
