import { Router } from "express";
import { checkUserExistsController, createUserController } from "./controller";
import { validateCreateUser } from "./validators";

const usuarioRouter = Router();

usuarioRouter.post('/checkuser', checkUserExistsController);
usuarioRouter.post('/user', validateCreateUser, createUserController )

export default usuarioRouter;