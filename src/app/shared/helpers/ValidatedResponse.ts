import { Usuario } from "../database/entities/Usuario";

export class ValidatedResponse {
	public pass: boolean;
	public titulo: string;
	public descricao: string;
	public criadoEm: Date;
	public usuario: Usuario;
}