import { NextFunction, Request, Response, Router } from "express";
import Factory from "../factory/Factory";

const authRoutes = Router();

const teste = (req: Request, res: Response, next: NextFunction) => {
	console.log(req);
	next();
}

authRoutes.post('/auth', Factory.authenticationController.authenticateUser.bind(Factory.authenticationController));
authRoutes.post('/googlelogin', teste, Factory.authenticationController.googleLogin.bind(Factory.authenticationController));

export default authRoutes;