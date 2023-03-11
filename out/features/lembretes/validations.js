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
exports.getUser = exports.requiredFieldsAreNotPresent = exports.requiredFieldsArePresent = exports.validate = exports.getTokenValidation = exports.tokenNotPresent = exports.tokenIsPresent = void 0;
const __1 = require("../..");
const ValidatedResponse_1 = require("../../entity/ValidatedResponse");
const httpResponses_1 = require("../httpResponses");
const tokenIsPresent = (req) => {
    return req.headers.access_token !== undefined;
};
exports.tokenIsPresent = tokenIsPresent;
const tokenNotPresent = (req) => {
    return !(0, exports.tokenIsPresent)(req);
};
exports.tokenNotPresent = tokenNotPresent;
const getTokenValidation = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const savedToken = yield __1.tokenRepository.findOneBy({ userId });
    return {
        userHasValidToken: savedToken && today < savedToken.expiraEm,
        requestTokenPass: savedToken && req.headers.access_token === savedToken.accessToken
    };
});
exports.getTokenValidation = getTokenValidation;
const validate = (req, res, requiredFields) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, exports.tokenNotPresent)(req))
        return (0, httpResponses_1.unauthorized)(res, 'Token não encontrado ou inválido.');
    if ((0, exports.requiredFieldsAreNotPresent)(req, requiredFields))
        return (0, httpResponses_1.bad)(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
    const usuario = yield (0, exports.getUser)(req.body.userId);
    if (!usuario)
        return (0, httpResponses_1.bad)(res, `Erro: o id ${req.body.userId} não está vinculado a nenhum usuário ativo.`);
    const tokenValidation = yield (0, exports.getTokenValidation)(req, usuario.id);
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
exports.requiredFieldsArePresent = requiredFieldsArePresent;
const requiredFieldsAreNotPresent = (req, requiredFields) => {
    return !(0, exports.requiredFieldsArePresent)(req, requiredFields);
};
exports.requiredFieldsAreNotPresent = requiredFieldsAreNotPresent;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield __1.usuarioRepository.findOneBy({ id });
});
exports.getUser = getUser;
