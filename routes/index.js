import express from "express";
import {
 
  addProduct,

  createBill,
  getAllBills,
  GetProduct,
  Login,
  Profile,
  registetration
 
} from "../services/index.js";

const routes = express.Router();

routes.post('/register', registetration);
routes.post('/login', Login);
routes.post('/add-product', addProduct);
routes.get('/profile', Profile);
routes.get('/get-product', GetProduct);
routes.post('/add-bill', createBill);
routes.get('/bills', getAllBills);



export default routes;
