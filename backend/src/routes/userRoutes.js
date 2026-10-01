import express from "express"
const router=express.Router();
import {loginUser, logoutUser, registerUser} from "../controller/userController.js"
import { authenticateUser } from "../middlewear/authenticate.js";

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.post("/logout",authenticateUser,logoutUser);


export default router ;