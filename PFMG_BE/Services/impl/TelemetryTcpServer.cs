using PFMG.DTOs;
using PFMG.Models;
using PFMG.Repositories;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Buffers.Binary;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace PFMG.Services.impl
{
    public class TelemetryTcpServer : BackgroundService
    {
        private readonly ILogger<TelemetryTcpServer> _log;
        private readonly IPEndPoint _ep;
        private readonly IServiceProvider _sp;

        public TelemetryTcpServer(ILogger<TelemetryTcpServer> log, IConfiguration cfg, IServiceProvider sp)
        {
            _log = log;
            _sp = sp;
            int port = cfg.GetValue<int?>("Telemetry:Port") ?? 5055;
            _ep = new IPEndPoint(IPAddress.Any, port);
        }

        protected override async Task ExecuteAsync(CancellationToken ct)
        {
            var listener = new TcpListener(_ep);
            listener.Start();
            _log.LogInformation("Telemetry TCP listening on {EndPoint}", _ep);

            try
            {
                while (!ct.IsCancellationRequested)
                {
                    var client = await listener.AcceptTcpClientAsync(ct);
                    _ = Task.Run(() => HandleClientAsync(client, ct));
                }
            }
            finally { listener.Stop(); }
        }

        private async Task HandleClientAsync(TcpClient client, CancellationToken ct)
        {
            using (client)
            {
                client.NoDelay = true;

                await using var stream = client.GetStream();
                using var br = new BinaryReader(stream, Encoding.UTF8, leaveOpen: true);

                var remote = client.Client.RemoteEndPoint?.ToString() ?? "unknown";
                _log.LogInformation("Client connected: {Remote}", remote);

                try
                {
                    while (!stream.DataAvailable && !ct.IsCancellationRequested)
                        await Task.Delay(5, ct);
                    if (ct.IsCancellationRequested) return;

                    if (!stream.DataAvailable)
                    {
                        _log.LogWarning("No data from {Remote}", remote);
                        return;
                    }

                    int count = br.ReadByte();
                    _log.LogInformation("Packet start: emitterCount={Count}", count);

                    var decoded = await DecodePacketAsync(stream, count, ct);

                    await using var scope = _sp.CreateAsyncScope();              
                    var repo = scope.ServiceProvider.GetRequiredService<IEmitterReadingRepository>();
                    var bus = _sp.GetRequiredService<WebSocketBroadcaster>();
                    var helper = scope.ServiceProvider.GetRequiredService<TelemetryHelper>();
                    var now = DateTime.UtcNow;

                    var random = new Random();
                    int jamIndex = random.Next(decoded.Count);
                    int i = 0;

                    foreach (var (id, bore) in decoded)
                    {
                        await repo.SaveAsync(new EmitterReading
                        {
                            EmitterName = id,
                            TimeUtc = now,
                            BoresightError = bore
                        }, ct);
                    }

                    foreach (var (id, bore) in decoded)
                    {
                        var (emitterDbId, lat, lon, freq) = await helper.EnrichAsync(id, ct);

                        bool isJammed = (i == jamIndex);

                        var dto = new FrontendReadingDto
                        {
                            EmitterId = id,
                            BoresightError = bore,
                            Jammed = isJammed,                              // true only if jamIndex 
                            Latitude = lat ?? "",                       // TelemetryHelper returns formatted strings
                            Longitude = lon ?? "",
                            Frequency = freq ?? 0f,                     // float per DTO
                            DetectionTime = now.ToString("o")           // ISO 8601 UTC
                        };

                        await bus.BroadcastAsync(dto, ct);             // sends full JSON frame to all clients
                        _log.LogInformation("Decoded: {Id} bore={Bore} jammed={Jammed} lat={Lat} lon={Lon} freq={Freq}",
                                            id, bore, isJammed, lat, lon, freq);
                        i++;
                    }

                    //foreach (var (id, bore) in decoded)
                    //    _log.LogInformation("Decoded: {Id} -> {Boresight}", id, bore);


                    //int drained = 0;
                    //var buffer = new byte[4096];
                    //while (stream.DataAvailable)
                    //{
                    //    // Use the widely-supported overload
                    //    int r = await stream.ReadAsync(buffer, 0, buffer.Length, ct);
                    //    if (r <= 0) break;
                    //    drained += r;
                    //}
                    //_log.LogInformation("Packet drained bytes={Drained}", drained);
                }
                catch (EndOfStreamException)
                {
                    _log.LogWarning("Client {Remote} closed stream mid-read", remote);
                }
                catch (Exception ex)
                {
                    _log.LogError(ex, "Client {Remote} handler error", remote);
                }
            }
        }

        private static async Task ReadExactAsync(Stream s, byte[] buf, int len, CancellationToken ct)
        {
            int off = 0;
            while (off < len)
            {
                int r = await s.ReadAsync(buf, off, len - off, ct);
                if (r <= 0) throw new EndOfStreamException("Short read");
                off += r;
            }
        }

        private async Task<List<(string Id, short Boresight)>> DecodePacketAsync(NetworkStream stream, int count, CancellationToken ct)
        {
            var items = new List<(string, short)>(count);
            var head = new byte[1];
            var b2 = new byte[2];

            for (int i = 0; i < count; i++)
            {
                await ReadExactAsync(stream, head, 1, ct);
                int idLen = head[0];

                var idBytes = new byte[idLen];
                await ReadExactAsync(stream, idBytes, idLen, ct);
                string id = Encoding.UTF8.GetString(idBytes);

                await ReadExactAsync(stream, b2, 2, ct);
                short boresight = BinaryPrimitives.ReadInt16BigEndian(b2);

                items.Add((id, boresight));
            }
            return items;
        }


    }
}