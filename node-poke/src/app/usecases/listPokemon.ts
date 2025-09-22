import type { PokemonRepository } from "../../domain/repositories/PokemonRepository.js";

export class ListPokemon {
  constructor(private repo: PokemonRepository) {}
  execute(params?: { limit?: number; offset?: number }) {
    const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
    const offset = Math.max(params?.offset ?? 0, 0);
    return this.repo.list(limit, offset);
  }
}
