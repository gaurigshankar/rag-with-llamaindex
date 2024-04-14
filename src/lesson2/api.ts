import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { getAnswerFromLLM } from "./lesson2";

const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  require("fastify")({
    logger: true,
  });

//@ts-ignore
fastify.get("/heartbeat", async (request, reply) => {
    reply.send({hello: "world"});
});
//@ts-ignore
fastify.get("/", async (request, reply) => {
  reply.code(200).header('Content-Type', 'application/json').send({hello: "llamaIndex RAG course"})
});

//@ts-ignore
fastify.post("/queryUsingLlamaIndex", async (request, reply) => {
  //@ts-ignore
  const { query } = request.body;
  const answerFromLLM = await getAnswerFromLLM(query);
  const response = {
    success: true,
    answerFromLLM,
  };
  console.log(`In API response ${JSON.stringify(response)}`);
  reply.code(200).header('Content-Type', 'application/json').send(response);
  return response;
});

const startServer = async () => {
  try {
    console.log(`sever starting`);
    await fastify.listen({ port: 3000 });
    console.log(`sever listening on port`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
