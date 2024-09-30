import express from "express";
import {
 
  addProduct,
  Genrate,
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
routes.post('/get-response',Genrate );


export default routes;
