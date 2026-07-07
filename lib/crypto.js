import crypto from 'crypto';

// AES-256-GCM 대칭 암호화 — AUTH_SECRET에서 파생한 키 사용(Node 런타임 전용).
// 주의: AUTH_SECRET이 바뀌면 기존 암호문은 복호화 불가 → SMTP 비번 재입력 필요.
function getKey() {
  const secret = process.env.AUTH_SECRET || 'chm-dev-fallback-key';
  return crypto.createHash('sha256').update(secret).digest(); // 32 bytes
}

export function encrypt(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const enc = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64'); // iv(12)+tag(16)+ct
}

export function decrypt(b64) {
  const buf = Buffer.from(b64, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}
