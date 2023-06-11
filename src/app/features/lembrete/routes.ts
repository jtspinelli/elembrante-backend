import { Router } from "express";
import { addLembreteController, getLembretesController } from "./controller";

const lembreteRouter = Router();

lembreteRouter.get('/lembretes', getLembretesController);
lembreteRouter.post('/lembrete', addLembreteController);

export default lembreteRouter;