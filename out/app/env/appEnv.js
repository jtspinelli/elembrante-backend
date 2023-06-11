"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appEnv = void 0;
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
dotenv_safe_1.default.config();
exports.appEnv = {
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    secret: process.env.SECRET
};
