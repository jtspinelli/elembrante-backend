"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const core_1 = require("@automapper/core");
const Lembrete_1 = require("./entity/Lembrete");
const dataSource_1 = require("./dataSource");
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const mapper_1 = __importDefault(require("./mappings/mapper"));
const LembreteDto_1 = __importDefault(require("./controller/dto/LembreteDto"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const LembreteService_1 = __importDefault(require("./services/LembreteService"));
const ValidationService_1 = __importDefault(require("./services/ValidationService"));
const LembreteController_1 = __importDefault(require("./controller/LembreteController"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const Factory_1 = __importDefault(require("./factory/Factory"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const lembreteRoutes_1 = __importDefault(require("./routes/lembreteRoutes"));
const port = process.env.PORT || 8081;
const key = fs_1.default.readFileSync(__dirname + '/cert/localhost.key');
const cert = fs_1.default.readFileSync(__dirname + '/cert/localhost.crt');
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, express_1.json)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true
}));
const server = https_1.default.createServer({ key, cert }, app);
/* #region Initialize Repositories */
// export const usuarioRepository = db.getRepository(Usuario);
// export const tokenRepository = db.getRepository(Token);
// export const lembreteRepository = db.getRepository(Lembrete);
/* #endregion */
/* #region Initialize Services */
const validationService = new ValidationService_1.default(Factory_1.default.usuarioRepository, Factory_1.default.lembreteRepository);
const lembreteService = new LembreteService_1.default(Factory_1.default.lembreteRepository);
/* #endregion */
/* #region Initialize Controllers */
// export const authenticationController = new AuthenticationController(Factory.usuarioRepository);
// const userController = new UserController(Factory.usuarioRepository, validationService);
const lembreteController = new LembreteController_1.default(validationService, lembreteService);
/* #endregion */
app.use(authRoutes_1.default);
app.use(userRoutes_1.default);
app.use(lembreteRoutes_1.default);
/* #region Create Mappings */
(0, core_1.createMap)(mapper_1.default, Lembrete_1.Lembrete, LembreteDto_1.default, (0, core_1.forMember)(dto => dto.usuarioId, (0, core_1.mapFrom)(lembrete => lembrete.usuario.id)));
/* #endregion */
// app.post('/checkuser', userController.userExists.bind(userController));
// app.post('/user', userController.createUser.bind(userController));
// app.put('/user/:id', userController.updateUser.bind(userController));
// app.delete('/user/:id', userController.removeUser.bind(userController));
// app.post('/auth', authenticationController.authenticateUser.bind(authenticationController));
// app.post('/googlelogin', authenticationController.googleLogin.bind(authenticationController));
// app.get('/lembretes', lembreteController.getLembretes.bind(lembreteController));
// app.post('/lembrete', lembreteController.addLembrete.bind(lembreteController));
// app.put('/lembrete/:id', lembreteController.updateLembrete.bind(lembreteController));
// app.put('/lembrete/archive/:id', lembreteController.archiveLembrete.bind(lembreteController));
// app.put('/lembrete/recover/:id', lembreteController.recoverLembrete.bind(lembreteController));
// app.delete('/lembrete/:id', lembreteController.removeLembrete.bind(lembreteController));
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
dataSource_1.db.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    // app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
    server.listen(port, () => console.log("APP RUNNING ON PORT " + port));
}));
