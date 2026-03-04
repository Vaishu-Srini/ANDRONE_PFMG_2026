using System;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;


public class TcpCsvSender
{
    // Fixed IP and Port
    private readonly string _serverIp = "169.254.211.246"; // replace with your server IP
    private readonly int _serverPort = 5000;         // replace with your server Port

    // ------------------------- CSV -------------------------
    public async Task SendCsvAsync(string csvFilePath)
    {
        try
        {
            string csvContent = await File.ReadAllTextAsync(csvFilePath, Encoding.UTF8);
            byte[] dataBytes = Encoding.UTF8.GetBytes(csvContent);

            byte[] key = Encoding.UTF8.GetBytes("Your32ByteFixedAES256EncryptionKey!!"); // ⭐ must be 32 bytes

            byte[] encryptedData = Encrypt(dataBytes, key, out byte[] nonce, out byte[] tag);

            // ✅ Build final message: [NONCE][TAG][DATA]
            byte[] finalPacket = new byte[nonce.Length + tag.Length + encryptedData.Length];
            Buffer.BlockCopy(nonce, 0, finalPacket, 0, nonce.Length);
            Buffer.BlockCopy(tag, 0, finalPacket, nonce.Length, tag.Length);
            Buffer.BlockCopy(encryptedData, 0, finalPacket, nonce.Length + tag.Length, encryptedData.Length);

            await SendTcpMessage(0, finalPacket);
            Console.WriteLine("✅ Encrypted CSV sent successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to send encrypted CSV: {ex.Message}");
        }
    }

    public async Task SendCsvWithoutEncryptionAsync(string csvFilePath)
    {
        try
        {
            // CSV already contains encrypted Base64 values per cell (header plaintext)
            byte[] dataBytes = await File.ReadAllBytesAsync(csvFilePath);

            await SendTcpMessage(0, dataBytes);
            Console.WriteLine("✅ CSV sent successfully (normal TCP, no extra encryption).");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to send CSV: {ex.Message}");
        }
    }




    // ------------------------- Drone Status -------------------------
    public async Task SendDroneStatusAsync(bool isGround)
    {
        try
        {
            byte dataByte = isGround ? (byte)1 : (byte)0; // 1 = GROUND, 0 = FLIGHT
            byte[] dataBytes = new byte[] { dataByte };

            await SendTcpMessage(1, dataBytes, includeSizeHeader: false); // command_id = 1, no size header
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to send drone status: {ex.Message}");
        }
    }


    // ------------------------- Core TCP Send -------------------------
    private async Task SendTcpMessage(int commandId, byte[] dataBytes, bool includeSizeHeader = true)
    {
        if (dataBytes == null || dataBytes.Length == 0)
        {
            Console.WriteLine("No data to send.");
            return;
        }

        byte[] commandBytes = BitConverter.GetBytes(commandId); // 4 bytes
        if (!BitConverter.IsLittleEndian) Array.Reverse(commandBytes);

        byte[] message;

        if (includeSizeHeader)
        {
            byte[] sizeBytes = BitConverter.GetBytes(dataBytes.Length); // 4 bytes
            if (!BitConverter.IsLittleEndian) Array.Reverse(sizeBytes);

            message = new byte[commandBytes.Length + sizeBytes.Length + dataBytes.Length];
            Buffer.BlockCopy(commandBytes, 0, message, 0, 4);
            Buffer.BlockCopy(sizeBytes, 0, message, 4, 4);
            Buffer.BlockCopy(dataBytes, 0, message, 8, dataBytes.Length);
        }
        else
        {
            // No size header for drone status
            message = new byte[commandBytes.Length + dataBytes.Length];
            Buffer.BlockCopy(commandBytes, 0, message, 0, 4);
            Buffer.BlockCopy(dataBytes, 0, message, 4, dataBytes.Length);
        }

        using (TcpClient client = new TcpClient())
        {
            await client.ConnectAsync(_serverIp, _serverPort);
            using (NetworkStream stream = client.GetStream())
            {
                await stream.WriteAsync(message, 0, message.Length);
                await stream.FlushAsync();
            }
        }

        Console.WriteLine($"✅ Sent command_id={commandId}, size={dataBytes.Length} bytes");
    }

    public string DecryptReceivedCsv(byte[] finalPacket)
    {
        byte[] key = Encoding.UTF8.GetBytes("Your32ByteFixedAES256EncryptionKey!!");

        byte[] nonce = finalPacket.AsSpan(0, 12).ToArray();
        byte[] tag = finalPacket.AsSpan(12, 28).ToArray();
        byte[] encryptedData = finalPacket.AsSpan(28).ToArray();

        byte[] decryptedData =
            Decrypt(encryptedData, key, nonce, tag);

        return Encoding.UTF8.GetString(decryptedData);
    }



    public static byte[] Encrypt(byte[] data, byte[] key, out byte[] nonce, out byte[] tag)
    {
        nonce = RandomNumberGenerator.GetBytes(12); // IV for AES-GCM
        tag = new byte[16]; // Authentication tag

        byte[] encrypted = new byte[data.Length];

        using var aes = new AesGcm(key);
        aes.Encrypt(nonce, data, encrypted, tag);

        return encrypted;
    }

    public static byte[] Decrypt(byte[] encryptedData, byte[] key, byte[] nonce, byte[] tag)
    {
        byte[] decrypted = new byte[encryptedData.Length];

        using var aes = new AesGcm(key);
        aes.Decrypt(nonce, encryptedData, tag, decrypted);

        return decrypted;
    }

        // ✅ Generate key once and store securely
    public static byte[] GenerateKey() => RandomNumberGenerator.GetBytes(32); // AES-256 key (32 bytes)
    
}
 