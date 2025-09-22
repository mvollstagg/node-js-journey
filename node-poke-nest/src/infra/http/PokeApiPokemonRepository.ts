import { z } from "zod";
import type { Pokemon } from "../../domain/entities/Pokemon.js";
import type { PokemonRepository } from "../../domain/repositories/PokemonRepository.js";
import { fetchJson } from "./httpClient.js";
import { MemoryCache } from "../cache/MemoryCache.js";
import { config } from "../config.js";

const PokeApiPokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  types: z.array(z.object({ type: z.object({ name: z.string() }) })),
  sprites: z.object({ front_default: z.string().nullable().optional() }).partial().optional(),
});

type PokeApiPokemon = z.infer<typeof PokeApiPokemonSchema>;

export class PokeApiPokemonRepository implements PokemonRepository {
  private cache = new MemoryCache(config.cacheTtlSeconds);

  async getByName(name: string): Promise<Pokemon> {
    const key = `pokemon:${name.toLowerCase()}`;
    const cached = this.cache.get<Pokemon>(key);
    if (cached) return cached;

    const json = await fetchJson<PokeApiPokemon>(`/pokemon/${encodeURIComponent(name.toLowerCase())}`);
    const parsed = PokeApiPokemonSchema.parse(json);

    const result: Pokemon = {
      id: parsed.id,
      name: parsed.name,
      height: parsed.height,
      weight: parsed.weight,
      types: parsed.types.map((t) => t.type.name),
      sprite: parsed.sprites?.front_default ?? null,
    };

    this.cache.set(key, result);
    return result;
  }

  async list(limit: number, offset: number) {
    const search = new URLSearchParams();
    search.set("limit", String(limit));
    search.set("offset", String(offset));

    return fetchJson<{ count: number; results: { name: string; url: string }[] }>(
      `/pokemon?${search.toString()}`,
    ).then(({ count, results }) => ({
      count,
      results: results.map((r) => ({ name: r.name })), // sadeleştir
    }));
  }
}
