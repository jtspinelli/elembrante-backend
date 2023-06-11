import { DataSource } from "typeorm";
import typeormconfig from "./typeorm.config";

const db: DataSource = new DataSource(typeormconfig);

export default db;