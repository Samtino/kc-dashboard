import { type JWTPayload, SignJWT, jwtVerify } from 'jose';

const secret = process.env.SECRET;
if (!secret) {
  throw new Error('Environment variable SECRET is not defined');
}
const encryptionKey = new TextEncoder().encode(secret);

export async function encrypt(payload: JWTPayload): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(encryptionKey);
  } catch (error: any) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

export async function decrypt(input: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(input, encryptionKey, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error: any) {
    throw new Error(`JWT verification failed: ${error.message}`);
  }
}
