import {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
  OpenAI,
  OpenAIEmbedding,
} from "llamaindex";
import * as llamaIndex from "llamaindex";
import { readConfig } from "./utils";

readConfig();

const createEmbeddingsInLocalDir = async () => {
  const storageContext = await llamaIndex.storageContextFromDefaults({
    persistDir: "./customGauriLocalEmbeddingStorage",
  });
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: "./data2", // we have the React wikipedia page in here
  });
  let index = await VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });
  let engine = await index.asQueryEngine();
  let response = await engine.query({ query: "What is JSX?" });
  console.log(response.toString());
};

const useEmbeddingsEarlierCreatedFromStorage = async () => {
  const storageContext = await llamaIndex.storageContextFromDefaults({
    persistDir: "./customGauriLocalEmbeddingStorage",
  });
  const index = await VectorStoreIndex.init({
    storageContext: storageContext,
  });

  let engine = await index.asQueryEngine();
  let response = await engine.query({ query: "What is JSX?" });
  console.log(response.toString());
};

const useRetreiverForChatApps = async () => {
  const storageContext = await llamaIndex.storageContextFromDefaults({
    persistDir: "./customGauriLocalEmbeddingStorage",
  });
  const index = await VectorStoreIndex.init({
    storageContext: storageContext,
  });

  const retriever = index.asRetriever();
  retriever.similarityTopK = 3;

  let chatEngine = new llamaIndex.ContextChatEngine({
    retriever,
  });
  let messageHistory = [
    {
      role: "user",
      content: "What is JSX?",
    },
    {
      role: "assistant",
      content:
        "JSX stands for JavaScript Syntax Extension. It is an extension to the JavaScript language syntax that provides a way to structure component rendering using syntax familiar to many developers. JSX is similar in appearance to HTML and is typically used to write React components, although components can also be written in pure JavaScript. It was created by Facebook and is similar to another extension syntax created for PHP called XHP.",
    },
  ];
  let newMessage = "What was that last thing you mentioned?";
  const response3 = await chatEngine.chat({
    message: newMessage,
    //@ts-ignore
    chatHistory: messageHistory,
  });
  console.log(response3.toString());
};


useRetreiverForChatApps();