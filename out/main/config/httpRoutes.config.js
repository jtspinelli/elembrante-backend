"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const routes_1 = require("../../app/features/login/routes");
const userRoutes_1 = __importDefault(require("../../routes/userRoutes"));
const lembreteRoutes_1 = __importDefault(require("../../routes/lembreteRoutes"));
function registerRoutes(app) {
    app.use(routes_1.loginRouter);
    app.use(userRoutes_1.default);
    app.use(lembreteRoutes_1.default);
}
exports.registerRoutes = registerRoutes;
