using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

public static class Aes256CsvEncryptor
{
    // Each cell is stored as Base64 of:
    // [1 byte ver][12 nonce][16 tag][ciphertext...]
    private const byte Version = 1;
    private const int KeySize = 32;
    private const int NonceSize = 12;
    private const int TagSize = 16;

    public static string EncryptCellToBase64(string plain, byte[] key32, byte[] aad)
    {
        if (key32 == null) throw new ArgumentNullException(nameof(key32));
        if (key32.Length != KeySize) throw new ArgumentException("Key must be 32 bytes (AES-256).", nameof(key32));
        if (aad == null) throw new ArgumentNullException(nameof(aad));

        plain ??= "";
        byte[] pt = Encoding.UTF8.GetBytes(plain);

        byte[] nonce = RandomNumberGenerator.GetBytes(NonceSize);
        byte[] ct = new byte[pt.Length];
        byte[] tag = new byte[TagSize];

        using (var gcm = new AesGcm(key32))
        {
            gcm.Encrypt(nonce, pt, ct, tag, aad);
        }

        byte[] packed = new byte[1 + NonceSize + TagSize + ct.Length];
        int o = 0;
        packed[o++] = Version;
        Buffer.BlockCopy(nonce, 0, packed, o, NonceSize); o += NonceSize;
        Buffer.BlockCopy(tag, 0, packed, o, TagSize); o += TagSize;
        Buffer.BlockCopy(ct, 0, packed, o, ct.Length);

        return Convert.ToBase64String(packed); // Base64 never contains comma -> safe for CSV
    }

    public static string DecryptCellFromBase64(string b64, byte[] key32, byte[] aad)
    {
        if (key32 == null) throw new ArgumentNullException(nameof(key32));
        if (key32.Length != KeySize) throw new ArgumentException("Key must be 32 bytes (AES-256).", nameof(key32));
        if (aad == null) throw new ArgumentNullException(nameof(aad));

        if (string.IsNullOrWhiteSpace(b64)) return "";

        byte[] packed = Convert.FromBase64String(b64);

        int minLen = 1 + NonceSize + TagSize;
        if (packed.Length < minLen) throw new FormatException("Encrypted cell payload too short.");

        int o = 0;
        byte ver = packed[o++];
        if (ver != Version) throw new NotSupportedException($"Unsupported version: {ver}");

        byte[] nonce = new byte[NonceSize];
        Buffer.BlockCopy(packed, o, nonce, 0, NonceSize); o += NonceSize;

        byte[] tag = new byte[TagSize];
        Buffer.BlockCopy(packed, o, tag, 0, TagSize); o += TagSize;

        int ctLen = packed.Length - o;
        byte[] ct = new byte[ctLen];
        Buffer.BlockCopy(packed, o, ct, 0, ctLen);

        byte[] pt = new byte[ctLen];
        using (var gcm = new AesGcm(key32))
        {
            gcm.Decrypt(nonce, ct, tag, pt, aad); // throws if wrong key/aad or tampered
        }

        return Encoding.UTF8.GetString(pt);
    }

    // Encrypts only DATA rows, keeps header readable.
    // NOTE: This assumes your CSV rows are created using string.Join(",") (no quoted commas).
    public static string EncryptCsvKeepHeader(string csvText, byte[] key32, byte[] aad)
    {
        if (string.IsNullOrEmpty(csvText)) return csvText;

        var lines = csvText.Replace("\r\n", "\n").Split('\n');
        if (lines.Length == 0) return csvText;

        var sb = new StringBuilder();

        // header unchanged
        sb.AppendLine(lines[0]);

        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i];
            if (string.IsNullOrWhiteSpace(line)) continue;

            var cols = line.Split(',');
            var encCols = cols.Select(c => EncryptCellToBase64(c, key32, aad));

            sb.AppendLine(string.Join(",", encCols));
        }

        return sb.ToString();
    }

    // Optional (for debugging / decode endpoint)
    public static string DecryptCsvKeepHeader(string encCsvText, byte[] key32, byte[] aad)
    {
        if (string.IsNullOrEmpty(encCsvText)) return encCsvText;

        var lines = encCsvText.Replace("\r\n", "\n").Split('\n');
        if (lines.Length == 0) return encCsvText;

        var sb = new StringBuilder();
        sb.AppendLine(lines[0]); // header

        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i];
            if (string.IsNullOrWhiteSpace(line)) continue;

            var cols = line.Split(',');
            var decCols = cols.Select(c => DecryptCellFromBase64(c, key32, aad));

            sb.AppendLine(string.Join(",", decCols));
        }

        return sb.ToString();
    }
}
