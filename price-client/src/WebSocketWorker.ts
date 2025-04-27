class WebSocketWorker {
    public isSubscribed = false;

    private socket: WebSocket | undefined;
    private callback: ((event: MessageEvent<any>) => void) | undefined;

    constructor(private url: string) {}

    subscribeToStockUpdates() {
        if (this.isSubscribed) return;

        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            this.isSubscribed = true;
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            if (this.callback) {
                this.callback(event);
            }
        };

        this.socket.onclose = () => {
            this.isSubscribed = false;
            console.log('WebSocket connection closed');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    unsubscribeFromStockUpdates() {
        if (this.isSubscribed) {
            this.socket?.send('unsubscribe');
            this.socket?.close(1000, 'Work complete');
        }
    }

    registedrUpdateHandler(callback: (event: MessageEvent<any>) => void) {
        this.callback = callback;
    }
}

const sockerWorker = new WebSocketWorker('ws://localhost:8080/ws');
export default sockerWorker;
