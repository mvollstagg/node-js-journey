import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

// Eski katmanlardan:
import { PokeApiPokemonRepository } from '../infra/http/PokeApiPokemonRepository.js';
import { GetPokemonByName } from '../app/usecases/getPokemonByName.js';
import { ListPokemon } from '../app/usecases/listPokemon.js';

@Module({
  controllers: [PokemonController],
  providers: [
    // Repository (infra)
    PokeApiPokemonRepository,
    // Use-case'ler (app)
    {
      provide: GetPokemonByName,
      useFactory: (repo: PokeApiPokemonRepository) => new GetPokemonByName(repo),
      inject: [PokeApiPokemonRepository],
    },
    {
      provide: ListPokemon,
      useFactory: (repo: PokeApiPokemonRepository) => new ListPokemon(repo),
      inject: [PokeApiPokemonRepository],
    },
    // Facade service (controller'ın kullanacağı)
    PokemonService,
  ],
  exports: [],
})
export class PokemonModule {}
