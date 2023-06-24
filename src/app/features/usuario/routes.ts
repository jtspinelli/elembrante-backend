import { Router } from "express";
import { checkUserExistsController, createUserController, removeUserController, updateUserController } from "./controller";
import { validateCreateUser, validateRemoveUser, validateUpdateUser } from "./validators";

const usuarioRouter = Router();

usuarioRouter.post('/checkuser', checkUserExistsController);
usuarioRouter.post('/user', validateCreateUser, createUserController );
usuarioRouter.delete('/user/:id', validateRemoveUser, removeUserController);
usuarioRouter.put('/user/:id', validateUpdateUser, updateUserController);

export default usuarioRouter;