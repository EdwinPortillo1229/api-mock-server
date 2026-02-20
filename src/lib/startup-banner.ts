import { ProviderInfo } from "./types.js";

export function printBanner(
  port: number,
  tunnelUrl: string | null,
  providers: ProviderInfo[]
) {
  const lines: string[] = [];

  lines.push("");
  lines.push("Mock API Server running!");
  lines.push("");
  lines.push(`  Local:   http://localhost:${port}`);
  if (tunnelUrl) {
    lines.push(`  Tunnel:  ${tunnelUrl}`);
  }

  for (const provider of providers) {
    lines.push("");
    lines.push(`${provider.name} (${provider.prefix}):`);
    for (const route of provider.routes) {
      const method = route.method.toUpperCase().padEnd(6);
      lines.push(`  ${method} ${route.url.padEnd(50)} ${route.description}`);
    }
  }

  // Admin routes
  lines.push("");
  lines.push("Admin:");
  lines.push(`  GET    ${"/__admin/errors".padEnd(50)} View active error rules`);
  lines.push(`  POST   ${"/__admin/errors".padEnd(50)} Add error simulation rule`);
  lines.push(`  DELETE ${"/__admin/errors".padEnd(50)} Clear all error rules`);

  lines.push("");

  console.log(lines.join("\n"));
}
