import { app } from "./app";
import { env } from "./env";

// Run the server!
const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: "RENDER" in process.env ? "0.0.0.0" : "localhost",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
