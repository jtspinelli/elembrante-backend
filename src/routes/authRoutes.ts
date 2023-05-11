import { NextFunction, Request, Response, Router } from "express";
import Factory from "../factory/Factory";

const authRoutes = Router();

authRoutes.post('/auth', Factory.authenticationController.authenticateUser.bind(Factory.authenticationController));
authRoutes.post('/googlelogin', Factory.authenticationController.googleLogin.bind(Factory.authenticationController));

export default authRoutes;