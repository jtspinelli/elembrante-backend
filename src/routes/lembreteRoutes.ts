import { Router } from "express";
import Factory from "../factory/Factory";

const lembreteRoutes = Router();

lembreteRoutes.get('/lembretes', Factory.lembreteController.getLembretes.bind(Factory.lembreteController));
lembreteRoutes.post('/lembrete', Factory.lembreteController.addLembrete.bind(Factory.lembreteController));
lembreteRoutes.put('/lembrete/:id', Factory.lembreteController.updateLembrete.bind(Factory.lembreteController));
lembreteRoutes.put('/lembrete/archive/:id', Factory.lembreteController.archiveLembrete.bind(Factory.lembreteController));
lembreteRoutes.put('/lembrete/recover/:id', Factory.lembreteController.recoverLembrete.bind(Factory.lembreteController));
lembreteRoutes.delete('/lembrete/:id', Factory.lembreteController.removeLembrete.bind(Factory.lembreteController));

export default lembreteRoutes;