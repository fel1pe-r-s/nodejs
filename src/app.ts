import Fastify, { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import transactionsRoutes from "./routes/transactions";

export const app: FastifyInstance = Fastify({
  logger: true,
});

app.register(
  cookie /* , {
  secret: "my-secret", // for cookies signature
  parseOptions: {}     // options for parsing cookies
} as FastifyCookieOptions */
);

// Declare a route
app.register(transactionsRoutes, { prefix: "transactions" });
