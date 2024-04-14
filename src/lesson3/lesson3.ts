import { Document, VectorStoreIndex, SimpleDirectoryReader, OpenAI, OpenAIEmbedding, } from "llamaindex";
import * as llamaIndex from "llamaindex";
import { readConfig } from "../utils";

readConfig();

const createIndexForDataSource1 = async () => {
    const documents = await new SimpleDirectoryReader().loadData({
        directoryPath: "./data"
    });
    const index = await VectorStoreIndex.fromDocuments(documents);
    return index;
}

const createIndexForDataSource2 = async () => {
    const documents = await new SimpleDirectoryReader().loadData({
        directoryPath: "./data2"
    });
    const index = await VectorStoreIndex.fromDocuments(documents);
    return index;
}

//@ts-ignore
function sumNumbers({a,b}) {
    return a + b;
}

const sumJSON = {
    type: "object",
    properties: {
        a: {
            type: "number",
            description: "The first number"
        },
        b: {
            type: "number",
            description: "The Second number"
        }
    },
    required: ["a", "b"]
}

const sumFunctionTool = new llamaIndex.FunctionTool(sumNumbers, {
    name: "sumNumbers",
    description: "Use this function to sum two numbers",
    parameters: sumJSON
})

export const getAnswerFromLLM = async () => {
   
    const indexForDataSource1 = await createIndexForDataSource1();
    const queryEngineDataSource1 = indexForDataSource1.asQueryEngine();
    const indexForDataSource2 = await createIndexForDataSource2();
    const queryEngineDataSource2 = indexForDataSource2.asQueryEngine();

    const queryEngine = await llamaIndex.RouterQueryEngine.fromDefaults({
        queryEngineTools: [
            {
                queryEngine: queryEngineDataSource1,
                description: "Useful for questions about Dan Abramov"
            },{
                queryEngine: queryEngineDataSource2,
                description: "Useful for questions about React Library"
            }
        ]
    })

    // const response1 = await queryEngine.query({query: "What is React?"});
    // console.log(response1.toString());

    // const response2 = await queryEngine.query({query: "What did Dan Abramov do in college?"});
    // console.log(response2.toString());

    const queryEngineTool = new llamaIndex.QueryEngineTool({
        queryEngine: queryEngine,
        metadata: {
            name: "react_and_dan_abramov_engine",
            description: "A tool that can answer questions about Dan Abramov and React"
        }
    });

    const agent = new llamaIndex.OpenAIAgent({
        tools: [queryEngineTool, sumFunctionTool],
        verbose: true
    });

    const response5 = await agent.chat({message:"What is React? Use a tool."})
    console.log(response5.toString())
    let response6 = await agent.chat({message:"What is 501 + 5?"})
    console.log(response6.toString())
}


const useQueryEngineTool = async() => {
   
}


getAnswerFromLLM()