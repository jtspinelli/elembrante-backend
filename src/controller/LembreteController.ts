import { Repository } from "typeorm";
import { Lembrete } from "../entity/Lembrete";
import { ValidatedResponse } from "../entity/ValidatedResponse";
import { LembreteViewModel } from "../viewModels/LembreteViewModel";
import { Request, Response } from 'express';
import { Usuario } from "../entity/Usuario";
import { internalError, success } from "./httpResponses";
import ValidationService from "../services/ValidationService";

class LembreteController {
	private repository: Repository<Lembrete>;
	private validationService: ValidationService;

	constructor(repository: Repository<Lembrete>, validationService: ValidationService){
		this.repository = repository;
		this.validationService = validationService;
	}

	private getLembrete = (titulo: string, descricao: string, criadoEm: Date, usuario: Usuario) => {
		const newLembrete = new Lembrete();
		newLembrete.titulo = titulo;
		newLembrete.descricao = descricao;
		newLembrete.usuario = usuario;
		newLembrete.criadoEm = criadoEm;
		newLembrete.arquivado = false;
	
		return newLembrete;
	}

	public async getLembretes(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, { strings: [], numbers: []}, null);
		if(!(validation instanceof ValidatedResponse)) return;
		
		const usuario = validation.usuario;
		const lembretes = usuario.lembretes
			.map(lembrete => {
				const viewModel = new LembreteViewModel();
				viewModel.id = lembrete.id;
				viewModel.arquivado = lembrete.arquivado;
				viewModel.titulo = lembrete.titulo;
				viewModel.descricao = lembrete.descricao;
				viewModel.criadoEm = lembrete.criadoEm;
	
				return viewModel;
			})
	
		return res.status(200).send(lembretes);
	}

	public async addLembrete(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: []}, null);
		if(!(validation instanceof ValidatedResponse)) return;
	
		const { titulo, descricao, usuario } = validation;
	
		const newLembrete = this.getLembrete(titulo, descricao, new Date(), usuario);	
	
		this.repository.save(newLembrete)
			.then((lembrete: Lembrete) => res.status(201).send(lembrete))
			.catch((err) => {
				console.log(err);
				internalError(res);
			});
	}

	public async updateLembrete(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
		if(!(validation instanceof ValidatedResponse)) return;
	
		const lembrete = await this.repository.findOneBy({id: Number(req.params.id)});
		if(!lembrete) return;
	
		lembrete.titulo = req.body.titulo;
		lembrete.descricao = req.body.descricao;
		this.repository.save(lembrete)
			.then((lembrete: Lembrete) => res.status(200).send(lembrete))
			.catch(() => internalError(res));
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
	
		const lembrete = await this.repository.findOneBy({id: Number(req.params.id)});
		if(!lembrete) return;
	
		lembrete.arquivado = value;
		this.repository.save(lembrete)
			.then(() => success(res))
			.catch(() => internalError(res));
	}

	public async removeLembrete(req: Request, res: Response) {
		const validation = await this.validationService.validate(req, res, {strings: [], numbers: []}, req.params.id);
		if(!(validation instanceof ValidatedResponse)) return;
	
		const lembrete = await this.repository.findOneBy({id: Number(req.params.id)});
		if(!lembrete) return;
	
		this.repository.remove(lembrete)
			.then(() => success(res))
			.catch(() => internalError(res));
	}
}

export default LembreteController;