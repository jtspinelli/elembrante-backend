"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notfound = exports.unauthorized = exports.bad = exports.success = exports.internalError = void 0;
const internalError = (res) => {
    return res.status(500).send('Erro interno no servidor.');
};
exports.internalError = internalError;
const success = (res) => {
    return res.status(200).send('Operação realizada com sucesso!');
};
exports.success = success;
const bad = (res, message) => {
    return res.status(400).send(message);
};
exports.bad = bad;
const unauthorized = (res, message) => {
    return res.status(401).send(message);
};
exports.unauthorized = unauthorized;
const notfound = (res, message) => {
    return res.status(404).send(message);
};
exports.notfound = notfound;
