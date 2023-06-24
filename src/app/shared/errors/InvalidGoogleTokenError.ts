import { Response } from 'express';

export class InvalidGoogleTokenError extends Error {
	constructor() {
		super('Google Token inválido.')
	}

	respond(res: Response) {
		return res.status(400).send({message: this.message})
	}
}