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
exports.validate = void 0;
const httpResponses_1 = require("../../shared/helpers/httpResponses");
const ValidatedResponse_1 = require("../../../controller/helpers/ValidatedResponse");
const appEnv_1 = require("../../env/appEnv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataSource_1 = __importDefault(require("../../../main/config/dataSource"));
const Lembrete_1 = require("../../shared/database/entities/Lembrete");
const Usuario_1 = require("../../shared/database/entities/Usuario");
function tokenIsPresent(req) {
    return req.cookies.sign !== undefined && req.cookies.token !== undefined;
}
function tokenNotPresent(req) {
    return !tokenIsPresent(req);
}
function requiredFieldsArePresent(req, requiredFields) {
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
function requiredFieldsAreNotPresent(req, requiredFields) {
    return !requiredFieldsArePresent(req, requiredFields);
}
const validate = (req, res, requiredFields, lembreteId) => __awaiter(void 0, void 0, void 0, function* () {
    if (tokenNotPresent(req))
        return (0, httpResponses_1.bad)(res, 'Token não encontrado ou inválido.');
    if (requiredFieldsAreNotPresent(req, requiredFields))
        return (0, httpResponses_1.bad)(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
    const accessToken = req.cookies.token + '.' + req.cookies.sign;
    try {
        const payload = jsonwebtoken_1.default.verify(accessToken, appEnv_1.appEnv.secret);
        const tokenExpired = Date.now() > payload.exp * 1000;
        if (tokenExpired)
            return (0, httpResponses_1.bad)(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');
        const usuarioRepository = dataSource_1.default.getRepository(Usuario_1.Usuario);
        const username = payload.username;
        const usuario = yield usuarioRepository.findOne({
            where: { username: username },
            relations: { lembretes: true }
        });
        if (!usuario)
            return (0, httpResponses_1.bad)(res, 'Usuário não encontrado');
        const lembreteRepository = dataSource_1.default.getRepository(Lembrete_1.Lembrete);
        let lembrete = null;
        if (lembreteId) {
            if (isNaN(Number(lembreteId)))
                return (0, httpResponses_1.bad)(res, 'Erro: o id do lembrete é inválido.');
            lembrete = yield lembreteRepository.findOne({
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
    catch (error) {
        return (0, httpResponses_1.bad)(res, 'Token inválido.');
    }
});
exports.validate = validate;