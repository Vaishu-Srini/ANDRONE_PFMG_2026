using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace PFMG.Services.impl
{
    public class WebSocketBroadcaster
    {
        private readonly object _gate = new();
        private readonly HashSet<WebSocket> _sockets = new();

        public void Add(WebSocket ws)
        {
            lock (_gate) _sockets.Add(ws);
        }

        public void Remove(WebSocket ws)
        {
            lock (_gate) _sockets.Remove(ws);
        }

        public async Task BroadcastAsync(object payload, CancellationToken ct)
        {
            var json = JsonSerializer.Serialize(payload);
            var msg = Encoding.UTF8.GetBytes(json);
            List<WebSocket> toRemove = new();

            lock (_gate)
            {
                foreach (var ws in _sockets)
                {
                    if (ws.State != WebSocketState.Open) toRemove.Add(ws);
                }
                foreach (var dead in toRemove) _sockets.Remove(dead);
            }

            foreach (var ws in toRemove) try { await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "cleanup", ct); } catch { }

            ArraySegment<byte> seg = new(msg);
            List<WebSocket> snapshot;
            lock (_gate) snapshot = _sockets.ToList();

            foreach (var ws in snapshot)
            {
                if (ws.State != WebSocketState.Open) continue;
                try { await ws.SendAsync(seg, WebSocketMessageType.Text, endOfMessage: true, ct); }
                catch { Remove(ws); }
            }
        }
    }
}

