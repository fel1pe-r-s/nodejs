import { knex as setupKnex, Knex } from "Knex";
import { env } from "./env";

if (!process.env.DATABASE_URL) {
  throw new Error("Please specify a database URL");
}

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};
export const knex = setupKnex(config);
