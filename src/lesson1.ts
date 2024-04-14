import { Document, VectorStoreIndex, SimpleDirectoryReader, OpenAI, OpenAIEmbedding, } from "llamaindex";
import * as llamaIndex from "llamaindex";
import { readConfig } from "./utils";

readConfig();

const createIndex = async () => {
    const documents = await new SimpleDirectoryReader().loadData({
        directoryPath: "./data"
    });
    const index = await VectorStoreIndex.fromDocuments(documents);
    return index;
}

const example1 = async () => {
   
    const index = await createIndex();
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query({
        query: "What did the author do in college?"
    });
    console.log(response.toString())
}

const example2 = async () => {
    
    const index = await createIndex();
    let customLLM = new OpenAI();
    let customEmbedding = new OpenAIEmbedding();
    //@ts-ignore
    let customServiceContext = new llamaIndex.serviceContextFromDefaults({
        llm: customLLM,
        embedModel: customEmbedding
    });

    let customResponseBuilder = new llamaIndex.SimpleResponseBuilder(customServiceContext, customQaPrompt);
    let customSynthesizer = new llamaIndex.ResponseSynthesizer({
        responseBuilder: customResponseBuilder,
        serviceContext: customServiceContext
    })
    let customReteiver = new llamaIndex.VectorIndexRetriever({index});

    let customQueryEngine = new llamaIndex.RetrieverQueryEngine(customReteiver, customSynthesizer);

    let response = await customQueryEngine.query({
        query: "What does the author think of college?"
    });

    console.log(response.toString())

   
}

const customQaPrompt =   ({context = "", query = ""}) => {
    return `Context information is below
    ----------------------------------
    ${context}
    ----------------------------------
    Given the context information, answer the query.
    Include a random fact about whales in your answer. The whale fact can come from your traning data. 
    Query : ${query}
    Answer: 
    `
}


example2();