import { AutoMap } from "@automapper/classes";

class LembreteDto {
	@AutoMap()
	id: number;

	@AutoMap()
	titulo: string;

	@AutoMap()
	descricao: string;

	@AutoMap()
	arquivado: boolean;

	@AutoMap()
	criadoEm: Date;

	usuarioId: number;
}

export default LembreteDto;