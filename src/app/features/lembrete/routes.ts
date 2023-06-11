import { Router } from "express";
import { addLembreteController, getLembretesController, removeLembreteController } from "./controller";

const lembreteRouter = Router();

lembreteRouter.get('/lembretes', getLembretesController);
lembreteRouter.post('/lembrete', addLembreteController);
lembreteRouter.delete('/lembrete/:id', removeLembreteController);

export default lembreteRouter;