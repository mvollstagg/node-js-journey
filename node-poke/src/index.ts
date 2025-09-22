import { config } from "./infra/config.js";
import { PokeApiPokemonRepository } from "./infra/http/PokeApiPokemonRepository.js";
import { GetPokemonByName } from "./app/usecases/getPokemonByName.js";
import { ListPokemon } from "./app/usecases/listPokemon.js";
import { createServer } from "./interfaces/http/server.js";

const repo = new PokeApiPokemonRepository();
const getPokemonByName = new GetPokemonByName(repo);
const listPokemon = new ListPokemon(repo);

createServer({ getPokemonByName, listPokemon }, config.port);
