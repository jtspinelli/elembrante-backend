"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeorm_config_1 = __importDefault(require("./typeorm.config"));
const db = new typeorm_1.DataSource(typeorm_config_1.default);
exports.default = db;
