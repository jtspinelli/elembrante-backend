import { googleLoginController, loginController } from "./controller";
import { validateLogin } from "./validators";
import { Router } from "express";

const loginRouter = Router();

loginRouter.post('/auth', validateLogin, loginController)
loginRouter.post('/googlelogin', googleLoginController)

export {loginRouter};