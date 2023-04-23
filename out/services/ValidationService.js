"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpResponses_1 = require("../controller/httpResponses");
const ValidatedResponse_1 = require("../entity/ValidatedResponse");
class ValidationService {
    constructor(usuarioRepository, lembreteRepository) {
        this.usuarioRepository = usuarioRepository;
        this.lembreteRepository = lembreteRepository;
    }
    validate(req, res, requiredFields, lembreteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.SECRET;
            if (!secret)
                return;
            if (this.tokenNotPresent(req))
                return (0, httpResponses_1.bad)(res, 'Token não encontrado ou inválido.');
            if (this.requiredFieldsAreNotPresent(req, requiredFields))
                return (0, httpResponses_1.bad)(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
            const accessToken = req.cookies.token + '.' + req.cookies.sign;
            try {
                const payload = jsonwebtoken_1.default.verify(accessToken, secret);
                const tokenExpired = Date.now() > payload.exp * 1000;
                if (tokenExpired)
                    return (0, httpResponses_1.bad)(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');
                const username = payload.username;
                const usuario = yield this.usuarioRepository.findOne({
                    where: { username: username },
                    relations: { lembretes: true }
                });
                if (!usuario)
                    return (0, httpResponses_1.bad)(res, 'Usuário não encontrado');
                let lembrete = null;
                if (lembreteId) {
                    if (isNaN(Number(lembreteId)))
                        return (0, httpResponses_1.bad)(res, 'Erro: o id do lembrete é inválido.');
                    lembrete = yield this.lembreteRepository.findOne({
                        where: { id: Number(lembreteId) },
                        relations: { usuario: true }
                    });
                    if (!lembrete)
                        return (0, httpResponses_1.bad)(res, `Erro: o id ${lembreteId} não está vinculado a nenhum lembrete`);
                }
                if (lembrete && lembrete.usuario.id !== usuario.id)
                    return (0, httpResponses_1.unauthorized)(res, 'Erro: não autorizado.');
                const response = new ValidatedResponse_1.ValidatedResponse();
                response.pass = true;
                if (usuario)
                    response.usuario = usuario;
                requiredFields.strings.forEach(field => {
                    eval(`
					response.${field} = req.body.${field};
				`);
                });
                return response;
            }
            catch (err) {
                return (0, httpResponses_1.bad)(res, 'Token inválido.');
            }
        });
    }
    tokenIsPresent(req) {
        return req.cookies.sign !== undefined && req.cookies.token !== undefined;
    }
    tokenNotPresent(req) {
        return !this.tokenIsPresent(req);
    }
    requiredFieldsArePresent(req, requiredFields) {
        let result = true;
        requiredFields.strings.forEach(field => {
            eval(`
				const ${field} = req.body.${field};
	
				if(${field} === undefined) result = false;
			`);
        });
        requiredFields.numbers.forEach(numberField => {
            eval(`
				const ${numberField} = Number(req.body.${numberField});
				if(!${numberField}) result = false;
			`);
        });
        return result;
    }
    requiredFieldsAreNotPresent(req, requiredFields) {
        return !this.requiredFieldsArePresent(req, requiredFields);
    }
}
exports.default = ValidationService;
