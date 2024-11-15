import express from "express";
import {
  genrateotp,
  server,
  verification,
  getAllUsers
 
} from "../../services/auth/index.js"

const routes = express.Router();
routes.get('/ping', server);
routes.post('/verification', verification);
routes.post('/create-otp', genrateotp);
routes.get('/get-client', getAllUsers);



export default routes;
