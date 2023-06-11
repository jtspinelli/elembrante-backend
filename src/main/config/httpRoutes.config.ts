import { Express } from 'express';
import { loginRouter } from '../../app/features/login/routes';
import userRoutes from '../../routes/userRoutes';
import lembreteRoutes from '../../routes/lembreteRoutes';
import usuarioRouter from '../../app/features/usuario/routes';

export function registerRoutes(app: Express) {
	app.use(loginRouter);
	app.use(usuarioRouter)
	app.use(userRoutes);
	app.use(lembreteRoutes);
}