import type { Pokemon } from '../entities/Pokemon.js';
import { fetchJson } from "../../infra/http/httpClient.js";

export interface PokemonRepository {
  getByName(name: string): Promise<Pokemon>;
  list(limit: number, offset: number): Promise<{ count: number; results: { name: string }[] }>;
}
