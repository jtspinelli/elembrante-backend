import { Router } from "express";
import { getLembretesController } from "./controller";

const lembreteRouter = Router();

lembreteRouter.get('/lembretes', getLembretesController);

export default lembreteRouter;