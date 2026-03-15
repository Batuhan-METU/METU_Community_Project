const { createClient } = require('@supabase/supabase-js');

const BUCKET = 'metuhub_media';

/**
 * Dosyayı Supabase Storage metuhub_media bucket'ına yükler, public URL döndürür.
 * @param {Buffer} fileBuffer - Yüklenecek dosya içeriği
 * @param {string} mimeType - Örn. 'image/jpeg'
 * @param {string} filePath - Bucket içi yol (örn. 'profile/abc-123.jpg')
 * @param {string} [accessToken] - Kullanıcı JWT (Storage RLS için; isteğe bağlı)
 * @returns {Promise<string>} Public URL
 */
async function uploadToBucket(fileBuffer, mimeType, filePath, accessToken = null) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL veya anon key tanımlı değil.');
  }

  // İkinci parametre mutlaka binary (Buffer) olmalı; obje gelirse "[object Object]" (15 byte) yüklenir
  if (!fileBuffer || typeof fileBuffer !== 'object') {
    throw new Error('Geçersiz dosya: buffer gerekli.');
  }
  if (!Buffer.isBuffer(fileBuffer)) {
    if (fileBuffer instanceof Uint8Array || (fileBuffer.buffer instanceof ArrayBuffer)) {
      fileBuffer = Buffer.from(fileBuffer);
    } else {
      throw new Error('Geçersiz dosya: binary buffer gerekli, obje gönderilmemeli.');
    }
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    ...(accessToken && { global: { headers: { Authorization: `Bearer ${accessToken}` } } }),
  });

  const { error } = await client.storage.from(BUCKET).upload(filePath, fileBuffer, {
    contentType: mimeType || 'application/octet-stream',
    upsert: true,
  });

  if (error) throw error;

  const { data } = client.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

module.exports = { uploadToBucket, BUCKET };
