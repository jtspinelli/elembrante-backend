"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidGoogleTokenError = void 0;
class InvalidGoogleTokenError extends Error {
    constructor() {
        super('Google Token inválido.');
    }
    respond(res) {
        return res.status(400).send({ message: this.message });
    }
}
exports.InvalidGoogleTokenError = InvalidGoogleTokenError;
