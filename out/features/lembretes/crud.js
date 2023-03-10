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
exports.addLembrete = void 0;
const __1 = require("../..");
const httpResponses_1 = require("../httpResponses");
const index_1 = require("./../../index");
const ValidatedResponse_1 = require("../../entity/ValidatedResponse");
const httpResponses_2 = require("./../httpResponses");
const Lembrete_1 = require("../../entity/Lembrete");
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
const validate = (req, res, requiredFields, requiredNumberFields) => __awaiter(void 0, void 0, void 0, function* () {
    if (tokenNotPresent(req))
        return (0, httpResponses_1.unauthorized)(res, 'Token não encontrado ou inválido.');
    if (requiredFieldsAreNotPresent(req, requiredFields, requiredNumberFields))
        return (0, httpResponses_1.bad)(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
    const usuario = yield userWasFound(req.body.userId);
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
    requiredFields.forEach(field => {
        eval(`
			response.${field} = req.body.${field};
		`);
    });
    return response;
});
const requiredFieldsArePresent = (req, requiredFields, requiredNumberFields) => {
    let result = true;
    requiredFields.forEach(field => {
        eval(`
			const ${field} = req.body.${field};

			if(!${field}) result = false;
		`);
    });
    requiredNumberFields.forEach(numberField => {
        eval(`
			const ${numberField} = Number(req.body.${numberField});
			if(!${numberField}) result = false;
		`);
    });
    return result;
};
const requiredFieldsAreNotPresent = (req, requiredFields, requiredNumberFields) => {
    return !requiredFieldsArePresent(req, requiredFields, requiredNumberFields);
};
const userWasFound = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield __1.usuarioRepository.findOneBy({ id });
    if (!user)
        return false;
    return user;
});
const getLembrete = (titulo, descricao, usuario) => {
    const newLembrete = new Lembrete_1.Lembrete();
    newLembrete.titulo = titulo;
    newLembrete.descricao = descricao;
    newLembrete.usuario = usuario;
    newLembrete.excluido = false;
    return newLembrete;
};
const addLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield validate(req, res, ["titulo", "descricao"], ["userId"]);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const { titulo, descricao, usuario } = validation;
    const newLembrete = getLembrete(titulo, descricao, usuario);
    index_1.lembreteRepository.save(newLembrete)
        .then(() => (0, httpResponses_1.success)(res))
        .catch((err) => {
        console.log(err);
        (0, httpResponses_2.internalError)(res);
    });
});
exports.addLembrete = addLembrete;
