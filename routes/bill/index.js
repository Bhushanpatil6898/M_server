import express from "express";
import {
  createBill,
  deleteBills,
  getAllBills,
} from "../../services/bill/index.js"

const billroutes = express.Router();

billroutes.post('/add-bill', createBill);
billroutes.get('/bills', getAllBills);
billroutes.post('/delete-bill', deleteBills);

export default billroutes;
