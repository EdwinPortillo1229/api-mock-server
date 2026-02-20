import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { applyTemplate } from "../../../lib/template-engine.js";

const FIXTURES_DIR = path.join(import.meta.dirname, "..", "fixtures");

export function registerSmsSessionsRoute(server: FastifyInstance) {
  server.get<{
    Params: { userId: string };
    Querystring: { next_page_token?: string; from?: string; to?: string; page_size?: string };
  }>(
    "/phone/users/:userId/sms/sessions",
    async (request) => {
      const { userId } = request.params;
      const { next_page_token: nextPageToken } = request.query;

      const fixtureFile = nextPageToken ? "sms_sessions_page_2.json" : "sms_sessions_page_1.json";
      const filePath = path.join(FIXTURES_DIR, fixtureFile);
      const raw = fs.readFileSync(filePath, "utf-8");
      const json = applyTemplate(raw, { userId });

      return JSON.parse(json);
    }
  );
}
