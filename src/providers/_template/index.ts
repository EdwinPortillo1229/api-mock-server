import { FastifyInstance } from "fastify";
import { registerExampleRoute } from "./routes/example.js";
import { ProviderInfo } from "../../lib/types.js";

export const TEMPLATE_PREFIX = "/v1";

export const templateProviderInfo: ProviderInfo = {
  name: "Template Integration",
  prefix: TEMPLATE_PREFIX,
  routes: [
    { method: "GET", url: "/v1/example", description: "Example endpoint" },
  ],
};

export async function templateProvider(server: FastifyInstance) {
  registerExampleRoute(server);
}
