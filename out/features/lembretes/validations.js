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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const __1 = require("../..");
const index_1 = require("./../../index");
const ValidatedResponse_1 = require("../../entity/ValidatedResponse");
const httpResponses_1 = require("../httpResponses");
const validate = (req, res, requiredFields, lembreteId) => __awaiter(void 0, void 0, void 0, function* () {
    if (tokenNotPresent(req))
        return (0, httpResponses_1.unauthorized)(res, 'Token não encontrado ou inválido.');
    if (requiredFieldsAreNotPresent(req, requiredFields))
        return (0, httpResponses_1.bad)(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
    let lembrete = null;
    if (lembreteId) {
        if (isNaN(Number(lembreteId)))
            return (0, httpResponses_1.bad)(res, 'Erro: o id do lembrete é inválido.');
        lembrete = yield index_1.lembreteRepository.findOne({
            where: { id: Number(lembreteId) },
            relations: { usuario: true }
        });
        if (!lembrete)
            return (0, httpResponses_1.bad)(res, `Erro: o id ${lembreteId} não está vinculado a nenhum lembrete`);
    }
    if (!lembrete && !req.body.userId)
        return (0, httpResponses_1.bad)(res, 'Não foi possível localizar informações do usuário.');
    const usuario = lembrete ? lembrete.usuario : yield getUser(req.body.userId);
    if (!usuario)
        return (0, httpResponses_1.bad)(res, `Erro: o id ${req.body.userId} não está vinculado a nenhum usuário ativo.`);
    const tokenValidation = yield getTokenValidation(req, usuario.id);
    if (!tokenValidation.userHasValidToken)
        return (0, httpResponses_1.bad)(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');
    if (!tokenValidation.requestTokenPass)
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
});
exports.validate = validate;
const tokenIsPresent = (req) => {
    return req.headers.access_token !== undefined;
};
const tokenNotPresent = (req) => {
    return !tokenIsPresent(req);
};
const getTokenValidation = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const savedToken = yield __1.tokenRepository.findOneBy({ userId });
    return {
        userHasValidToken: savedToken && today < savedToken.expiraEm,
        requestTokenPass: savedToken && req.headers.access_token === savedToken.accessToken
    };
});
const requiredFieldsArePresent = (req, requiredFields) => {
    let result = true;
    requiredFields.strings.forEach(field => {
        eval(`
			const ${field} = req.body.${field};

			if(!${field}) result = false;
		`);
    });
    requiredFields.numbers.forEach(numberField => {
        eval(`
			const ${numberField} = Number(req.body.${numberField});
			if(!${numberField}) result = false;
		`);
    });
    return result;
};
const requiredFieldsAreNotPresent = (req, requiredFields) => {
    return !requiredFieldsArePresent(req, requiredFields);
};
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield __1.usuarioRepository.findOneBy({ id });
});
