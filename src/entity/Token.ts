import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column()
	accessToken: string;

	@Column()
	expiraEm: Date;
}