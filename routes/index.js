import express from "express";
import {
 
  addProduct,

  createBill,
  deleteBills,
  deleteProduct,
  getAllBills,
  GetProduct,
  Login,
  Profile,
  registetration,
  verification
 
} from "../services/index.js";
import { cheack } from "../middleware/jwt/index.js";

const routes = express.Router();
routes.post('/verification', verification);
routes.post('/register', registetration);
routes.post('/login', Login);
routes.post('/add-product', addProduct);
routes.post('/delete-product', deleteProduct);
routes.get('/profile',cheack, Profile);
routes.get('/get-product', GetProduct);
routes.post('/add-bill', createBill);
routes.get('/bills', getAllBills);
routes.post('/delete-bill', deleteBills);



export default routes;
