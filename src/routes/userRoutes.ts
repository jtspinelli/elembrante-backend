import { Router } from "express";
import Factory from "../factory/Factory";

const userRoutes = Router();

userRoutes.post('/checkuser', Factory.usuarioControler.userExists.bind(Factory.usuarioControler));
userRoutes.post('/user', Factory.usuarioControler.createUser.bind(Factory.usuarioControler));
userRoutes.put('/user/:id', Factory.usuarioControler.updateUser.bind(Factory.usuarioControler));
userRoutes.delete('/user/:id', Factory.usuarioControler.removeUser.bind(Factory.usuarioControler));

export default userRoutes;