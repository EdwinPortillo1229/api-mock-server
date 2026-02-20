import { createServer } from "./server.js";
import { zoomProvider, ZOOM_PREFIX, zoomProviderInfo } from "./providers/zoom/index.js";
import { printBanner } from "./lib/startup-banner.js";

const PORT = parseInt(process.env.PORT || "4010", 10);
const NGROK_ENABLED = process.env.NGROK_ENABLED === "true";

async function main() {
  const server = createServer();

  // Register providers
  await server.register(zoomProvider, { prefix: ZOOM_PREFIX });

  // Start the server
  await server.listen({ port: PORT, host: "0.0.0.0" });

  // Optionally start ngrok tunnel
  let tunnelUrl: string | null = null;
  if (NGROK_ENABLED) {
    const ngrok = await import("@ngrok/ngrok");
    const listener = await ngrok.default.forward({
      addr: PORT,
      authtoken_from_env: true,
    });
    tunnelUrl = listener.url();
  }

  // Print startup banner
  printBanner(PORT, tunnelUrl, [zoomProviderInfo]);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
