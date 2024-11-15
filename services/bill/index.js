import BillModel from "../../schemas/index.js";



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
    const { billId } = req.body;
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
