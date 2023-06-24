import axios from "axios";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UsuarioRepository } from "../../usuario/repository";
import { InvalidGoogleTokenError } from "../../../shared/errors/InvalidGoogleTokenError";
import { Usuario } from "../../../shared/database/entities/Usuario";
import { serialize } from "cookie";
import { randomUUID } from "crypto";

export class GoogleLoginUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(usuarioRepository: UsuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	async createToken(user: Usuario) {
		const secret = process.env.SECRET;
		if(!secret) return;
		
		return new Promise<{userData: { nome: string, username: string }, headerPayload: string, sign: string} | null>((res, _rej) => {
			const userData = {id: user.id, nome: user.nome, username: user.username };
			jwt.sign(
				userData, 
				secret,
				{
					expiresIn: 600
				},
				(_err, jwtToken) => {
					const sign = serialize('sign', (jwtToken as string).split('.')[2], {
						httpOnly: true,
						secure: true,
						sameSite: 'strict',						
						maxAge: 600,
						path: '/',
					});
	
					res({userData, headerPayload: `${(jwtToken as string).split('.')[0]}.${(jwtToken as string).split('.')[1]}`, sign})
				}
			);
		})
	}

	async getGoogleUserData(token: string): Promise<{ status: number, data: {email: string, name: string} }> {
		const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + token;

		return await axios.get(url)
			.then(data => data)
			.catch(e => e);
	}

	async execute(credential: string) {
		const googleResponse = await this.getGoogleUserData(credential);
		if(googleResponse.status !== 200) throw new InvalidGoogleTokenError();

		const user = await this.usuarioRepository.findByUsername(googleResponse.data.email);
		if(user) return await this.createToken(user);

		const hashedRandomPass = await bcrypt.hash(randomUUID(), 10);

		const newUser = new Usuario();
		newUser.nome = googleResponse.data.name;
		newUser.username = googleResponse.data.email;
		newUser.senha = hashedRandomPass;

		await this.usuarioRepository.save(newUser);
		return await this.createToken(newUser);
	}
}