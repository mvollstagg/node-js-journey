import http from "node:http";
import { parse } from "node:url";
import { GetPokemonByName } from "../../app/usecases/getPokemonByName.js";
import { ListPokemon } from "../../app/usecases/listPokemon.js";
import { log } from "../../infra/logging/logger.js";

type RouterDeps = {
  getPokemonByName: GetPokemonByName;
  listPokemon: ListPokemon;
};

export function createServer(deps: RouterDeps, port: number) {
  const server = http.createServer(async (req, res) => {
    if (!req.url || !req.method) {
      res.writeHead(400); res.end("Bad Request"); return;
    }
    const { pathname, query } = parse(req.url, true);

    res.setHeader("Content-Type", "application/json; charset=utf-8");

    try {
      // GET /health
      if (req.method === "GET" && pathname === "/health") {
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      // GET /pokemon?name=pikachu
      if (req.method === "GET" && pathname === "/pokemon") {
        const name = (query?.name as string | undefined)?.trim();
        if (!name) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "query param 'name' is required" }));
          return;
        }
        const data = await deps.getPokemonByName.execute(name);
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
      }

      // GET /pokemon/list?limit=20&offset=0
      if (req.method === "GET" && pathname === "/pokemon/list") {
        const limit = Number((query?.limit as string) ?? "20");
        const offset = Number((query?.offset as string) ?? "0");
        const data = await deps.listPokemon.execute({ limit, offset });
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not Found" }));
    } catch (err) {
      log.error(err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: (err as Error).message }));
    }
  });

  server.listen(port, () => log.info(`HTTP listening on :${port}`));
  return server;
}
