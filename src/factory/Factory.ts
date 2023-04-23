import { Lembrete } from "../entity/Lembrete";
import { Usuario } from "../entity/Usuario";
import { db } from "../dataSource";
import AuthenticationController from "../controller/AuthenticationController";
import ValidationService from "../services/ValidationService";
import UserController from "../controller/UserController";
import LembreteService from "../services/LembreteService";
import LembreteController from "../controller/LembreteController";

abstract class Factory {
	private static _usuarioRepository = db.getRepository(Usuario);
	private static _lembreteRepository = db.getRepository(Lembrete);
	private static _authenticationController: AuthenticationController;
	private static _validationService: ValidationService;
	private static _lembreteService: LembreteService;
	private static _usuarioController: UserController;
	private static _lembreteController: LembreteController;

	public static get usuarioRepository() {
		return Factory._usuarioRepository;
	}

	public static get lembreteRepository() {
		return Factory._lembreteRepository;
	}

	public static get authenticationController() {
		if(!Factory._authenticationController) {
			Factory._authenticationController = new AuthenticationController(Factory._usuarioRepository);
		}

		return Factory._authenticationController;
	}

	private static get validationService() {
		if(!Factory._validationService) {
			Factory._validationService = new ValidationService(Factory.usuarioRepository, Factory.lembreteRepository)
		}

		return Factory._validationService;
	}

	private static get lembreteService() {
		if(!Factory._lembreteService) {
			Factory._lembreteService = new LembreteService(Factory.lembreteRepository);
		}

		return Factory._lembreteService;
	}

	public static get usuarioControler() {
		if(!Factory._usuarioController) {
			Factory._usuarioController = new UserController(Factory.usuarioRepository, Factory.validationService);
		}

		return Factory._usuarioController;
	}

	public static get lembreteController() {
		if(!Factory._lembreteController) {
			Factory._lembreteController = new LembreteController(Factory.validationService, Factory.lembreteService);
		}

		return Factory._lembreteController;
	}
}

export default Factory;