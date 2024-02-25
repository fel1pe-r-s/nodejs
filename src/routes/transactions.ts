import { FastifyInstance } from "fastify";
import { knex } from "../db";
import { z } from "zod";
import { randomUUID } from "crypto";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkSessionIdExists);
  app.get("/", { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies;
    const transactions = await knex("transactions").where(
      "session_id",
      sessionId
    );
    return { transactions };
  });
  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const transaction = await knex("transactions")
      .where({
        session_id: sessionId,
        id,
      })
      .first();

    return { transaction };
  });
  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;
      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" });

      return { summary };
    }
  );
  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
      session_id: z.string().uuid().optional(),
    });

    const { title, amount, type } = bodySchema.parse(request.body);
    const id = randomUUID();
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
      });
    }
    await knex("transactions").insert({
      id,
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });
    return reply.status(201).send({});
  });
}

//ESM
export default transactionsRoutes;
