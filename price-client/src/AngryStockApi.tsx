export type PriceUpdateEvent = {
    Id: number;
    Name: string;
    Price: number;
    LastUpdated: string;
};

export type PriceUpdateCallback = (event: PriceUpdateEvent) => void;

var baseUrl = 'ws://localhost:8080/ws';
var socket: WebSocket | undefined;
var callback: PriceUpdateCallback | undefined;

export interface IAngryStockApi {
    subscribeToStockUpdates: (callback: PriceUpdateCallback) => void;
    unsubscribeFromStockUpdates: () => void;
    isSubscribed: () => boolean;
}

/*
 * Subscribes to stock updates via WebSocket.
 * If already subscribed, it logs a message and does nothing.
 * If no callback is provided, it logs a message and does nothing.
 * When a message is received, it calls the provided callback with the event.
 * When the connection is closed, it resets the socket and callback variables.
 */
const subscribeToStockUpdates = (handler: PriceUpdateCallback) => {
    if (socket) {
        console.log('Already subscribed to stock updates');
        return;
    }

    if (!handler) {
        console.log('No callback provided for stock updates');
        return;
    }

    socket = new WebSocket(baseUrl);
    socket.onopen = () => {
        console.log('Connected to stock updates');
        callback = handler;
        socket?.send(JSON.stringify({ action: 'subscribe' }));
    };

    socket.onmessage = (event) => {
        if (handler) {
            const priceUpdate: PriceUpdateEvent = JSON.parse(event.data);
            console.log('Received stock update:', priceUpdate);
            handler(priceUpdate);
        }
    };

    socket.onclose = () => {
        console.log('Disconnected and unsubscribed from stock updates');
        socket = undefined;
        callback = undefined;
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    console.log('Subscribed to stock updates');
};

/*
 * Unsubscribes from stock updates and closes the WebSocket connection.
 * If no subscription exists, it logs a message indicating that.
 */
const unsubscribeFromStockUpdates = () => {
    if (!socket) {
        console.log('Not subscribed to stock updates');
        return;
    }
    socket.send(JSON.stringify({ action: 'unsubscribe' }));
    socket.close();
};

/*
 * Checks if the WebSocket connection is active.
 * Returns true if subscribed, false otherwise.
 */
const isSubscribed = () => {
    return socket !== undefined;
};

export const AngryStockApi: IAngryStockApi = {
    subscribeToStockUpdates,
    unsubscribeFromStockUpdates,
    isSubscribed,
};
