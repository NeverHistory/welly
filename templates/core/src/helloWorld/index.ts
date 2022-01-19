import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {exampleString} from "../lib/index.js";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log(event);

    return {
        statusCode: 200,
        body: `HelloWorld: ${exampleString}`
    };
};