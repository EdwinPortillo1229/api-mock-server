import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ErrorRule } from "./types.js";
import path from "node:path";
import fs from "node:fs";

const errorRules: ErrorRule[] = [];

function loadErrorFixture(statusCode: number, fixturesDir: string): object {
  const filePath = path.join(fixturesDir, `${statusCode}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return { code: statusCode, message: `Simulated error ${statusCode}` };
}

/**
 * Fastify hook that intercepts requests based on:
 * 1. X-Mock-Error header (per-request)
 * 2. Active error rules from /__admin/errors (stateful)
 */
export function errorSimulationHook(fixturesDir: string) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    // 1. Check X-Mock-Error header
    const headerError = request.headers["x-mock-error"];
    if (headerError) {
      const statusCode = parseInt(String(headerError), 10);
      if (statusCode >= 400 && statusCode < 600) {
        const body = loadErrorFixture(statusCode, fixturesDir);
        reply.code(statusCode).send(body);
        return;
      }
    }

    // 2. Check stateful error rules
    for (let i = errorRules.length - 1; i >= 0; i--) {
      const rule = errorRules[i];
      if (request.url.includes(rule.pathPattern)) {
        const body = loadErrorFixture(rule.statusCode, fixturesDir);
        rule.remaining--;
        if (rule.remaining <= 0) {
          errorRules.splice(i, 1);
        }
        reply.code(rule.statusCode).send(body);
        return;
      }
    }
  };
}

/**
 * Registers /__admin/errors routes for managing error simulation rules.
 */
export function registerAdminRoutes(server: FastifyInstance) {
  server.get("/__admin/errors", async () => {
    return { rules: errorRules };
  });

  server.post<{
    Body: { pathPattern: string; statusCode: number; count?: number };
  }>("/__admin/errors", async (request) => {
    const { pathPattern, statusCode, count = 1 } = request.body;
    const rule: ErrorRule = { pathPattern, statusCode, remaining: count };
    errorRules.push(rule);
    return { added: rule, totalRules: errorRules.length };
  });

  server.delete("/__admin/errors", async () => {
    const cleared = errorRules.length;
    errorRules.length = 0;
    return { cleared };
  });
}
