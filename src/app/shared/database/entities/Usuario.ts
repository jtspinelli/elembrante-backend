import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Lembrete } from "./Lembrete";

@Entity()
export class Usuario {
	@PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({unique: true})
    username: string;

    @Column()
    senha: string;

	@OneToMany(() => Lembrete, (lembrete) => lembrete.usuario)
	lembretes: Lembrete[];

	@Column({default: false})
	excluido: boolean;
}