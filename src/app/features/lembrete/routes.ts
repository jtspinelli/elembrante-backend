import { Router } from "express";
import { addLembreteController, archiveLembreteController, getLembretesController, recoverLembreteController, removeLembreteController, updateLembreteController } from "./controller";

const lembreteRouter = Router();

lembreteRouter.get('/lembretes', getLembretesController);
lembreteRouter.post('/lembrete', addLembreteController);
lembreteRouter.delete('/lembrete/:id', removeLembreteController);
lembreteRouter.put('/lembrete/archive/:id', archiveLembreteController);
lembreteRouter.put('/lembrete/recover/:id', recoverLembreteController);
lembreteRouter.put('/lembrete/:id', updateLembreteController);

export default lembreteRouter;