import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	accessToken: string;

	@Column()
	expiraEm: Date;
}