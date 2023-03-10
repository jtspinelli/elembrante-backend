import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Lembrete {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	titulo: string;

	@Column()
	descricao: string;

	@ManyToOne(() => Usuario, (usuario) => usuario.lembretes)
	usuario: Usuario;

	@Column()
	excluido: boolean;
}