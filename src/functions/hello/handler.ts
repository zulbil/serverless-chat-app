import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';


const hello = async (event) => {
  console.log('Event :',event);
  return formatJSONResponse({
    message: `Email ${event.requestContext.authorizer.claims.email} has been authorized`
  });
};

export const main = middyfy(hello);
