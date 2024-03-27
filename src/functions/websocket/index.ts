import { handlerPath } from '@libs/handler-resolver';

export const connect = {
    handler: `${handlerPath(__dirname)}/handler.onConnect`,
    events: [
        {
            websocket: {
                route: "$connect"
            }
        }
    ]
};

export const disconnect = {
    handler: `${handlerPath(__dirname)}/handler.onDisconnect`,
    events: [
        {
            websocket: {
                route: "$disconnect"
            }
        }
    ]
};


export const defaultMessageHandler = {
    handler: `${handlerPath(__dirname)}/handler.defaultMessageHandler`,
    events: [
        {
            websocket: {
                route: "$default"
            }
        }
    ]
};