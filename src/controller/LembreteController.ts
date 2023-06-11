// import { internalError, success } from "./helpers/httpResponses";
// import { ValidatedResponse } from "./helpers/ValidatedResponse";
// import { Request, Response } from 'express';
// import { ExpressRouteFunc } from "./helpers/types";
// import LembreteService from "../services/LembreteService";
// import ValidationService from "../services/ValidationService";

// class LembreteController {
// 	private validationService: ValidationService;
// 	private service: LembreteService;

// 	constructor(validationService: ValidationService, lembreteService: LembreteService){
// 		this.validationService = validationService;
// 		this.service = lembreteService;
// 	}

// 	// public getLembretes() : ExpressRouteFunc {
// 	// 	return async(req: Request, res: Response) => {
// 	// 		const validation = await this.validationService.validate(req, res, { strings: [], numbers: []}, null);
// 	// 		if(!(validation instanceof ValidatedResponse)) return;
			
// 	// 		return res.status(200).send(await this.service.getAll(validation.usuario.id));
// 	// 	}
// 	// }

// 	// public addLembrete() : ExpressRouteFunc {
// 	// 	return async (req: Request, res: Response) => {
// 	// 		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: []}, null);
// 	// 		if(!(validation instanceof ValidatedResponse)) return;
			
// 	// 		const { titulo, descricao, usuario } = validation;
// 	// 		const newLembrete = await this.service.create(titulo, descricao, usuario);
// 	// 		if(!newLembrete) return internalError(res);
			
// 	// 		res.status(201).send(newLembrete);
// 	// 	}
// 	// }

// 	// public updateLembrete() {
// 	// 	return async (req: Request, res: Response) => {

// 	// 		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
// 	// 		if(!(validation instanceof ValidatedResponse)) return;
			
// 	// 		const lembrete = await this.service.update(Number(req.params.id), req.body.titulo, req.body.descricao);
			
// 	// 		if(!lembrete) {
// 	// 			return internalError(res);
// 	// 		}
			
// 	// 		res.status(200).send(lembrete);
// 	// 	}
// 	}

// 	// public archiveLembrete() : ExpressRouteFunc {
// 	// 	return this.setArchive(true);
// 	// }
	
// 	// public recoverLembrete() : ExpressRouteFunc {
// 	// 	return this.setArchive(false);
// 	// }
	
// 	// private setArchive(value: boolean) : ExpressRouteFunc {
// 	// 	return async(req: Request, res: Response) => {

// 	// 		const validation = await this.validationService.validate(req, res, {strings: [], numbers: []}, req.params.id);
// 	// 		if(!(validation instanceof ValidatedResponse)) return;
			
// 	// 		if(!(await this.service.setArchive(Number(req.params.id), value))) {
// 	// 			return internalError(res);
// 	// 		};
			
// 	// 		success(res);
// 	// 	}
// 	// }

// 	// public removeLembrete() : ExpressRouteFunc {
// 	// 	return async (req: Request, res: Response) => {
// 	// 		const validation = await this.validationService.validate(req, res, {strings: [], numbers: []}, req.params.id);
// 	// 		if(!(validation instanceof ValidatedResponse)) return;
			
// 	// 		if(!(await this.service.remove(Number(req.params.id)))) {
// 	// 			internalError(res);
// 	// 		}
			
// 	// 		return success(res);
// 	// 	}
// 	// }
// }

// export default LembreteController;