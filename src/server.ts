import Fastify, { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import transactionsRoutes from "./routes/transactions";
import { env } from "./env";

const app: FastifyInstance = Fastify({
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

// Run the server!
const start = async () => {
  try {
    await app.listen({ port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
