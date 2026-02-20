import { FastifyInstance } from "fastify";
import { registerSmsSessionsRoute } from "./routes/sms-sessions.js";
import { registerSessionMessagesRoute } from "./routes/session-messages.js";
import { registerUsersMeRoute } from "./routes/users-me.js";
import { ProviderInfo } from "../../lib/types.js";

export const ZOOM_PREFIX = "/v2";

export const zoomProviderInfo: ProviderInfo = {
  name: "Zoom Integration",
  prefix: ZOOM_PREFIX,
  routes: [
    { method: "GET", url: "/v2/phone/users/:userId/sms/sessions", description: "SMS sessions (paginated)" },
    { method: "GET", url: "/v2/phone/sms/sessions/:sessionId", description: "Session messages" },
    { method: "GET", url: "/v2/users/me", description: "User info" },
  ],
};

export async function zoomProvider(server: FastifyInstance) {
  registerSmsSessionsRoute(server);
  registerSessionMessagesRoute(server);
  registerUsersMeRoute(server);
}
