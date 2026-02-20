import Fastify from "fastify";
import path from "node:path";
import { errorSimulationHook, registerAdminRoutes } from "./lib/error-simulation.js";

export function createServer() {
  const server = Fastify({
    logger: {
      level: "info",
    },
  });

  // Default error fixtures directory (Zoom errors, used as fallback)
  const defaultErrorsDir = path.join(import.meta.dirname, "providers", "zoom", "fixtures", "errors");

  // Register error simulation hook (runs before route handlers)
  server.addHook("onRequest", errorSimulationHook(defaultErrorsDir));

  // Register admin routes
  registerAdminRoutes(server);

  return server;
}
