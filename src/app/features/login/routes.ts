import { Router } from "express";
import { loginController } from "./controller";
import { validateLogin } from "./validators";

const loginRouter = Router();

loginRouter.post('/', validateLogin, loginController)

export {loginRouter};