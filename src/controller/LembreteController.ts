import { internalError, success } from "./httpResponses";
import { ValidatedResponse } from "../entity/ValidatedResponse";
import { Request, Response } from 'express';
import LembreteService from "../services/LembreteService";
import ValidationService from "../services/ValidationService";

class LembreteController {
	private validationService: ValidationService;
	private service: LembreteService;

	constructor(validationService: ValidationService, lembreteService: LembreteService){
		this.validationService = validationService;
		this.service = lembreteService;
	}

	public async getLembretes(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, { strings: [], numbers: []}, null);
		if(!(validation instanceof ValidatedResponse)) return;

		return res.status(200).send(await this.service.getAll(validation.usuario.id));
	}

	public async addLembrete(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: []}, null);
		if(!(validation instanceof ValidatedResponse)) return;
	
		const { titulo, descricao, usuario } = validation;
		const newLembrete = await this.service.create(titulo, descricao, usuario);
		if(!newLembrete) return internalError(res);

		res.status(201).send(newLembrete);
	}

	public async updateLembrete(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
		if(!(validation instanceof ValidatedResponse)) return;

		const lembrete = await this.service.update(Number(req.params.id), req.body.titulo, req.body.descricao);

		if(!lembrete) {
			return internalError(res);
		}

		res.status(200).send(lembrete);
	}

	public async archiveLembrete(req: Request, res: Response) {
		this.setArchive(req, res, true);
	}
	
	public async recoverLembrete(req: Request, res: Response) {
		this.setArchive(req, res, false);
	}
	
	private async setArchive(req: Request, res: Response, value: boolean) {
		const validation = await this.validationService.validate(req, res, {strings: [], numbers: []}, req.params.id);
		if(!(validation instanceof ValidatedResponse)) return;

		if(!(await this.service.setArchive(Number(req.params.id), value))) {
			return internalError(res);
		};

		success(res);
	}

	public async removeLembrete(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, {strings: [], numbers: []}, req.params.id);
		if(!(validation instanceof ValidatedResponse)) return;

		if(!(await this.service.remove(Number(req.params.id)))) {
			internalError(res);
		}

		success(res);
	}
}

export default LembreteController;