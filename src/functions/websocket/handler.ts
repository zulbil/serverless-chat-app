import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { formatJSONResponse } from '@libs/api-gateway';
//import { connectionService } from '../../services'

export const onConnect: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Websocket connect', event)
  
        const connectionId = event.requestContext.connectionId
        const timestamp = new Date().toISOString()
    
        const item = {
            id: connectionId,
            timestamp
        }
    
        console.log('Storing item: ', item)
    
        //await connectionService.createConnection(item);
    
        return formatJSONResponse({
            message: 'Connected ...',
        });
    } catch (error) {
        console.log('Error occured :',error.message);
        return formatJSONResponse({
            message: 'Connexion failed',
            error: error.message
        }, 404)
    }
}

export const onDisconnect: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Websocket disconnect', event)
  
        const connectionId = event.requestContext.connectionId

        console.log('Removing item with key: ', connectionId)

        //await connectionService.deleteConnection(connectionId);
    
        return formatJSONResponse({
            message: 'Connected ...',
        });

    } catch (error) {
        console.log('Error occured :',error.message);
        return formatJSONResponse({
            message: 'Disconnexion failed',
            error: error.message
        }, 404)
    }
}


export const defaultMessageHandler : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // Code to handle incoming WebSocket messages
      // Could include routing messages to the appropriate function
  
      return formatJSONResponse({
        message: 'Message received',
      });
  
    } catch (error) {
      console.log('Error occured :',error.message);
      return formatJSONResponse({
        message: 'Message not received',
        error: error.message
      }, 404)
    }
  };