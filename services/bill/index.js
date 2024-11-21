import logAction from "../../middleware/activity/index.js";
import BillModel, { clientModel, notificationModel } from "../../schemas/index.js";

export const createBill = async (req, res) => {
  const { id } = req.user;
  
    
  try {
    const user = await clientModel.findById(id);
    const { customerName, contactNumber, address, productList, totalAmount } = req.body
    const formattedProductList = productList.map(product => ({
      productName: product.productName,
      quantity: Number(product.quantity),
      price: Number(product.price)
    }));

    const newBill = new BillModel({
      customerName,
      contactNumber,
      address,
      productList: formattedProductList,
      totalAmount: Number(totalAmount)
    });
    await newBill.save();
    const admin = await clientModel.findOne({ role: "admin" });
    if (admin) {
      const adminNotification = new notificationModel({
        recipient: admin._id,
        type: "billing",
        message: `New bill generated for customer: ${customerName} . Total Amount: ₹${totalAmount}`,
      });
      await adminNotification.save();
    }
    logAction(
      admin._id,
      'CREATE_BILL',
      `Bill created by ${user.firstName} ${user.lastName} (Email: ${user.email}) for customer: ${customerName}  with a total amount of ${totalAmount}.`,
      req
   );
    res.status(200).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error); // Log error for debugging
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
};
export const deleteBills = async (req, res) => {
  const { id } = req.user;

  try {
    const { billId } = req.body;
    const deletedbill = await BillModel.findByIdAndDelete(billId);
    const user = await clientModel.findById(id);

    if (!deletedbill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    logAction(
      user._id,
      'DELETE_BILL',
      `Bill deleted by ${user.firstName} ${user.lastName} (Email: ${user.email}) for customer: ${deletedbill.customerName} `,
      req
   );

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
