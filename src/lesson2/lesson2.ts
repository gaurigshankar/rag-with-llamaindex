import { Document, VectorStoreIndex, SimpleDirectoryReader, OpenAI, OpenAIEmbedding, } from "llamaindex";
import * as llamaIndex from "llamaindex";
import { readConfig } from "../utils";

readConfig();

const createIndex = async () => {
    const documents = await new SimpleDirectoryReader().loadData({
        directoryPath: "./data"
    });
    const index = await VectorStoreIndex.fromDocuments(documents);
    return index;
}

export const getAnswerFromLLM = async (queryForLLM: string) => {
   
    const index = await createIndex();
    const queryEngine = index.asQueryEngine();
    console.log(`The user;s query is ${queryForLLM}`)
    const response = await queryEngine.query({
        query: queryForLLM
    });
    console.log(response.toString());
    return response.toString();
}