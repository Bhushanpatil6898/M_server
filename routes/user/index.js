import express from "express";
import {
 
  Login,
  logout,
  Profile,
  registetration,
  updatepassword,
  updateProfile, 
 
} from "../../services/user/index.js"

import { cheack } from "../../middleware/jwt/index.js";






const userroutes = express.Router();

userroutes.post('/register', registetration);
userroutes.post('/login', Login);
userroutes.post('/logout', logout);
userroutes.get('/profile',cheack, Profile);
userroutes.post('/update-password',cheack, updatepassword);
userroutes.post('/update-profile',cheack, updateProfile);

export default userroutes;
