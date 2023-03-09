import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Usuario {
	@PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    username: string;

    @Column()
    senha: string;  
}