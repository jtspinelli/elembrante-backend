import { Router } from "express";
import { checkUserExistsController } from "./controller";

const usuarioRouter = Router();

usuarioRouter.post('/checkuser', checkUserExistsController);

export default usuarioRouter;