using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;

namespace PFMG.Services.impl
{
    public class WebSocketHandler
    {
        private static readonly ConcurrentBag<WebSocket> _sockets = new();

        public void AddSocket(WebSocket socket)
        {
            _sockets.Add(socket);
        }

        public async Task RemoveSocketAsync(WebSocket socket)
        {
            _sockets.TryTake(out _);
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by server", CancellationToken.None);
        }

        public async Task SendMessageToAllAsync(string message)
        {
            var buffer = Encoding.UTF8.GetBytes(message);
            var segment = new ArraySegment<byte>(buffer);

            foreach (var socket in _sockets)
            {
                if (socket.State == WebSocketState.Open)
                {
                    await socket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
}