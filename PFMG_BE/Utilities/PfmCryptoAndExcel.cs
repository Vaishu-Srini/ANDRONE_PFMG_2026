using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using ClosedXML.Excel;

public static class PfmCryptoAndExcel
{
    // ===== AES-256-GCM packing format =====
    // [1 byte version][12 nonce][16 tag][ciphertext...]
    private const byte Version = 1;
    private const int NonceSize = 12;
    private const int TagSize = 16;
    private const int KeySize = 32;

    public static byte[] EncryptAes256Gcm(byte[] plaintext, byte[] key32, byte[]? aad = null)
    {
        if (plaintext == null) throw new ArgumentNullException(nameof(plaintext));
        if (key32 == null) throw new ArgumentNullException(nameof(key32));
        if (key32.Length != KeySize) throw new ArgumentException("Key must be 32 bytes (AES-256).", nameof(key32));

        byte[] nonce = RandomNumberGenerator.GetBytes(NonceSize);
        byte[] ciphertext = new byte[plaintext.Length];
        byte[] tag = new byte[TagSize];

        using (var gcm = new AesGcm(key32))
        {
            gcm.Encrypt(nonce, plaintext, ciphertext, tag, aad);
        }

        byte[] packed = new byte[1 + NonceSize + TagSize + ciphertext.Length];
        int o = 0;
        packed[o++] = Version;
        Buffer.BlockCopy(nonce, 0, packed, o, NonceSize); o += NonceSize;
        Buffer.BlockCopy(tag, 0, packed, o, TagSize); o += TagSize;
        Buffer.BlockCopy(ciphertext, 0, packed, o, ciphertext.Length);

        return packed;
    }

    public static byte[] DecryptAes256Gcm(byte[] packed, byte[] key32, byte[]? aad = null)
    {
        if (packed == null) throw new ArgumentNullException(nameof(packed));
        if (key32 == null) throw new ArgumentNullException(nameof(key32));
        if (key32.Length != KeySize) throw new ArgumentException("Key must be 32 bytes (AES-256).", nameof(key32));

        int minLen = 1 + NonceSize + TagSize;
        if (packed.Length < minLen) throw new FormatException("Encrypted payload too short.");

        int o = 0;
        byte version = packed[o++];
        if (version != Version) throw new NotSupportedException($"Unsupported version: {version}");

        byte[] nonce = new byte[NonceSize];
        Buffer.BlockCopy(packed, o, nonce, 0, NonceSize); o += NonceSize;

        byte[] tag = new byte[TagSize];
        Buffer.BlockCopy(packed, o, tag, 0, TagSize); o += TagSize;

        int cipherLen = packed.Length - o;
        byte[] ciphertext = new byte[cipherLen];
        Buffer.BlockCopy(packed, o, ciphertext, 0, cipherLen);

        byte[] plaintext = new byte[cipherLen];
        using (var gcm = new AesGcm(key32))
        {
            gcm.Decrypt(nonce, ciphertext, tag, plaintext, aad); // throws CryptographicException if tampered/wrong key
        }

        return plaintext;
    }

    // ===== CSV -> XLSX bytes (ClosedXML, free) =====
    // NOTE: this uses simple Split(',') which matches your current CSV creation (string.Join(",") no quoting/escaping).
    public static byte[] CsvToXlsxBytes(string csvPath, string sheetName = "PFM")
    {
        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add(sheetName);

        int row = 1;
        foreach (var line in File.ReadLines(csvPath, Encoding.UTF8))
        {
            var cols = line.Split(',');
            for (int col = 0; col < cols.Length; col++)
            {
                ws.Cell(row, col + 1).Value = cols[col];
            }
            row++;
        }

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }

    // private async Task SaveEncryptedXlsxToDatabaseAsync(
    //     string xlsxFileName,
    //     byte[] encryptedXlsxBytes,
    //     int missionId,
    //     int? areaInterestId,
    //     PfmgType pfmgType)
    // {
    //         var entity = new PfmgFileStorage
    //         {
    //             FileName = xlsxFileName,
    //             FileType = "application/octet-stream", // encrypted bytes (not a real xlsx until decrypted)
    //             FileData = encryptedXlsxBytes,
    //             missionId = missionId,
    //             areaInterestId = areaInterestId ?? 0,
    //             pfmgType = pfmgType,
    //             UploadedOn = DateTime.UtcNow
    //         };

    //         _context.pfmgFileStorages.Add(entity);
    //         await _context.SaveChangesAsync();
    // }

    public static string SanitizeFileName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "NA";
        foreach (var c in Path.GetInvalidFileNameChars())
            name = name.Replace(c, '_');
        return name.Trim();
    }

   



}
