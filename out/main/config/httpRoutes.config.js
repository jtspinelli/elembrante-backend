"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const routes_1 = require("../../app/features/login/routes");
const routes_2 = __importDefault(require("../../app/features/usuario/routes"));
const routes_3 = __importDefault(require("../../app/features/lembrete/routes"));
function registerRoutes(app) {
    app.use(routes_1.loginRouter);
    app.use(routes_2.default);
    app.use(routes_3.default);
    // app.use(lembreteRoutes);
}
exports.registerRoutes = registerRoutes;
