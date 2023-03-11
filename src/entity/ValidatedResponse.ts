import { Usuario } from './Usuario';

export class ValidatedResponse {
	public pass: boolean;
	public titulo: string;
	public descricao: string;
	public usuario: Usuario;
}