import type { Pokemon } from "../../domain/entities/Pokemon.js";
import type { PokemonRepository } from "../../domain/repositories/PokemonRepository.js";

export class GetPokemonByName {
  constructor(private repo: PokemonRepository) {}
  execute(name: string): Promise<Pokemon> {
    if (!name) throw new Error("name is required");
    return this.repo.getByName(name);
  }
}
