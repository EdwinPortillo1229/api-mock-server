import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { applyTemplate } from "../../../lib/template-engine.js";

const FIXTURES_DIR = path.join(import.meta.dirname, "..", "fixtures");

export function registerExampleRoute(server: FastifyInstance) {
  server.get(
    "/example",
    async () => {
      const filePath = path.join(FIXTURES_DIR, "example.json");
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(applyTemplate(raw));
    }
  );
}
