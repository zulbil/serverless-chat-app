import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const main = middyfy(
  async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    console.log('Event :',event);
    return formatJSONResponse({
      message: `Email ${event.requestContext.authorizer.claims.email} has been authorized`
    });
  }
);

