import { Router } from "express";
import { checkUserExistsController, createUserController, removeUserController } from "./controller";
import { validateCreateUser, validateRemoveUser } from "./validators";

const usuarioRouter = Router();

usuarioRouter.post('/checkuser', checkUserExistsController);
usuarioRouter.post('/user', validateCreateUser, createUserController );
usuarioRouter.delete('/user/:id', validateRemoveUser, removeUserController);

export default usuarioRouter;