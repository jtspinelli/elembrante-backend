import { Router } from "express";
import Factory from "../factory/Factory";

const userRoutes = Router();

// userRoutes.post('/checkuser', Factory.usuarioControler.userExists());
userRoutes.post('/user', Factory.usuarioControler.createUser());
userRoutes.put('/user/:id', Factory.usuarioControler.updateUser());
userRoutes.delete('/user/:id', Factory.usuarioControler.removeUser());

export default userRoutes;