"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appEnv = void 0;
// dotenv.config();
exports.appEnv = {
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    secret: process.env.SECRET
};
