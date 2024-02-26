import { app } from "./app";
import { env } from "./env";

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
