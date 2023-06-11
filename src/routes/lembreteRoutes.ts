import { Router } from "express";
import Factory from "../factory/Factory";

const lembreteRoutes = Router();

// lembreteRoutes.get('/lembretes', Factory.lembreteController.getLembretes());
// lembreteRoutes.post('/lembrete', Factory.lembreteController.addLembrete());
lembreteRoutes.put('/lembrete/:id', Factory.lembreteController.updateLembrete());
lembreteRoutes.put('/lembrete/archive/:id', Factory.lembreteController.archiveLembrete());
lembreteRoutes.put('/lembrete/recover/:id', Factory.lembreteController.recoverLembrete());
// lembreteRoutes.delete('/lembrete/:id', Factory.lembreteController.removeLembrete());

export default lembreteRoutes;