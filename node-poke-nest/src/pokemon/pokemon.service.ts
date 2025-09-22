import { Injectable } from '@nestjs/common';
import { GetPokemonByName } from '../app/usecases/getPokemonByName.js';
import { ListPokemon } from '../app/usecases/listPokemon.js';

@Injectable()
export class PokemonService {
  constructor(
    private readonly getPokemonByName: GetPokemonByName,
    private readonly listPokemon: ListPokemon,
  ) {}

  getByName(name: string) {
    return this.getPokemonByName.execute(name);
  }

  list(limit?: number, offset?: number) {
    return this.listPokemon.execute({ limit, offset });
  }
}
