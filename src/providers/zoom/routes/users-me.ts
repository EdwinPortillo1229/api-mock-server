import { FastifyInstance } from "fastify";

export function registerUsersMeRoute(server: FastifyInstance) {
  server.get(
    "/users/me",
    async () => {
      return {
        id: "mock-zoom-user-id",
        first_name: "Mock",
        last_name: "User",
        display_name: "Mock User",
        email: "mock@example.com",
        type: 2,
        status: "active",
        phone_numbers: [
          {
            number: "+11111111111",
            country: { code: "US", name: "United States" },
          },
        ],
      };
    }
  );
}
