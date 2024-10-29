import express from "express";
import {
 
  addProduct,

  createBill,
  deleteBills,
  deleteProduct,
  genrateotp,
  getAllBills,
  getAllUsers,
  GetProduct,
  Login,
  logout,
  Profile,
  registetration,
  server,
  updatepassword,
  updateProfile,
  verification
 
} from "../services/index.js";
import { cheack } from "../middleware/jwt/index.js";

const routes = express.Router();
routes.get('/ping', server);
routes.post('/verification', verification);
routes.post('/register', registetration);
routes.post('/create-otp', genrateotp);
routes.post('/login', Login);
routes.post('/logout', logout);
routes.post('/add-product', addProduct);
routes.post('/delete-product', deleteProduct);
routes.get('/profile',cheack, Profile);
routes.get('/get-product', GetProduct);
routes.get('/get-client', getAllUsers);
routes.post('/add-bill', createBill);
routes.get('/bills', getAllBills);
routes.post('/delete-bill', deleteBills);
routes.post('/update-password',cheack, updatepassword);
routes.post('/update-profile',cheack, updateProfile);



export default routes;
