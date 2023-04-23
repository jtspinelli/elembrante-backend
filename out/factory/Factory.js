"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lembrete_1 = require("../entity/Lembrete");
const Usuario_1 = require("../entity/Usuario");
const dataSource_1 = require("../dataSource");
const AuthenticationController_1 = __importDefault(require("../controller/AuthenticationController"));
const ValidationService_1 = __importDefault(require("../services/ValidationService"));
const UserController_1 = __importDefault(require("../controller/UserController"));
const LembreteService_1 = __importDefault(require("../services/LembreteService"));
const LembreteController_1 = __importDefault(require("../controller/LembreteController"));
class Factory {
    static get usuarioRepository() {
        return Factory._usuarioRepository;
    }
    static get lembreteRepository() {
        return Factory._lembreteRepository;
    }
    static get authenticationController() {
        if (!Factory._authenticationController) {
            Factory._authenticationController = new AuthenticationController_1.default(Factory._usuarioRepository);
        }
        return Factory._authenticationController;
    }
    static get validationService() {
        if (!Factory._validationService) {
            Factory._validationService = new ValidationService_1.default(Factory.usuarioRepository, Factory.lembreteRepository);
        }
        return Factory._validationService;
    }
    static get lembreteService() {
        if (!Factory._lembreteService) {
            Factory._lembreteService = new LembreteService_1.default(Factory.lembreteRepository);
        }
        return Factory._lembreteService;
    }
    static get usuarioControler() {
        if (!Factory._usuarioController) {
            Factory._usuarioController = new UserController_1.default(Factory.usuarioRepository, Factory.validationService);
        }
        return Factory._usuarioController;
    }
    static get lembreteController() {
        if (!Factory._lembreteController) {
            Factory._lembreteController = new LembreteController_1.default(Factory.validationService, Factory.lembreteService);
        }
        return Factory._lembreteController;
    }
}
Factory._usuarioRepository = dataSource_1.db.getRepository(Usuario_1.Usuario);
Factory._lembreteRepository = dataSource_1.db.getRepository(Lembrete_1.Lembrete);
exports.default = Factory;