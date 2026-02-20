import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { applyTemplate } from "../../../lib/template-engine.js";

const FIXTURES_DIR = path.join(import.meta.dirname, "..", "fixtures");

const SESSION_FIXTURE_MAP: Record<string, string> = {
  sess_001: "session_messages_001.json",
  sess_002: "session_messages_002.json",
  sess_004: "session_messages_003.json",
};

export function registerSessionMessagesRoute(server: FastifyInstance) {
  server.get<{
    Params: { sessionId: string };
    Querystring: { next_page_token?: string; page_size?: string };
  }>(
    "/phone/sms/sessions/:sessionId",
    async (request, reply) => {
      const { sessionId } = request.params;
      const fixtureFile = SESSION_FIXTURE_MAP[sessionId];

      if (!fixtureFile) {
        reply.code(200).send({
          session_id: sessionId,
          next_page_token: "",
          page_size: 50,
          sms_histories: [],
        });
        return;
      }

      const filePath = path.join(FIXTURES_DIR, fixtureFile);
      const raw = fs.readFileSync(filePath, "utf-8");
      const json = applyTemplate(raw);

      return JSON.parse(json);
    }
  );
}
