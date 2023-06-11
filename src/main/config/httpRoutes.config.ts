import { Express } from 'express';
import { loginRouter } from '../../app/features/login/routes';
import lembreteRoutes from '../../routes/lembreteRoutes';
import usuarioRouter from '../../app/features/usuario/routes';
import lembreteRouter from '../../app/features/lembrete/routes';

export function registerRoutes(app: Express) {
	app.use(loginRouter);
	app.use(usuarioRouter)
	app.use(lembreteRouter);
	// app.use(lembreteRoutes);
}