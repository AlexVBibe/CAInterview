using System;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using Newtonsoft.Json;

class WebSocketServer
{
    private static HttpListener _listener;
    private static ConcurrentDictionary<Guid, WebSocket> _clients = new ConcurrentDictionary<Guid, WebSocket>();
    private static Random _random = new Random();

    public static async Task Start()
    {
        _listener = new HttpListener();
        _listener.Prefixes.Add("http://localhost:8080/ws/");
        _listener.Start();
        Console.WriteLine("WebSocket server started...");

        while (true)
        {
            var context = await _listener.GetContextAsync();

            if (context.Request.IsWebSocketRequest)
            {
                _ = HandleWebSocket(context);
            }
        }
    }

    private static async Task HandleWebSocket(HttpListenerContext context)
    {
        WebSocketContext wsContext = await context.AcceptWebSocketAsync(null);
        WebSocket socket = wsContext.WebSocket;
        var id = Guid.NewGuid();
        _clients[id] = socket;
        Console.WriteLine($"{DateTime.UtcNow} Client connected: {id} Clients: {_clients.Count}");

        // Create a task for listening to messages from the client
        var receiveTask = ReceiveMessagesFromClient(id, socket);

        // Create a task for sending data to the client
        var sendTask = SendDataToClient(id, socket);

        // Wait for either task to complete (this would be the task to be cancelled when needed)
        await Task.WhenAny(receiveTask, sendTask);

        // Cleanup after both tasks are done
        _clients.TryRemove(id, out _);
        Console.WriteLine($"{DateTime.UtcNow} Client disconnected: {id}  Clients: {_clients.Count}");
        socket.Dispose();
    }

    private static async Task SendDataToClient(Guid clientId, WebSocket socket)
    {
        while (socket.State == WebSocketState.Open)
        {
            await Task.Delay(1000);

            var priceData = GeneratePriceUpdate();
            var buffer = Encoding.UTF8.GetBytes(priceData);
            var segment = new ArraySegment<byte>(buffer);
            try
            {
                if (socket.State == WebSocketState.Open)
                {
                    await socket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
                    Console.WriteLine($"{DateTime.UtcNow} Sent price update to client {clientId}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Client {clientId} failed to send data with error: {ex.Message}");
                break;
            }
        }
    }

    private static async Task ReceiveMessagesFromClient(Guid clientId, WebSocket socket)
    {
        var buffer = new byte[1024 * 4];
        var messageType = WebSocketMessageType.Text;
        while (socket.State == WebSocketState.Open && messageType != WebSocketMessageType.Close)
        {
            try
            {
                var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                messageType = result.MessageType;
                if (messageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine($"Client {clientId} closed connection");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Client {clientId} failed with message: {ex.Message}");
                break;
            }
        }
    }

    private static string GeneratePriceUpdate()
    {
        var item = "Item-" + _random.Next(1, 10);
        var update = new
        {
            Id = item,
            Name = item,
            Price = Math.Round(_random.NextDouble() * 100, 2),
            LastUpdated = DateTime.UtcNow,
        };

        return JsonConvert.SerializeObject(update);
    }
}
