import express from "express";
import {

  addProduct,
  deleteProduct,
  GetProduct,
 
} from "../../services/product/index.js"

const productroutes = express.Router();
productroutes.post('/add-product', addProduct);
productroutes.post('/delete-product', deleteProduct);
productroutes.get('/get-product', GetProduct);



export default productroutes;
