import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const secret = process.env.SECRET;
const encryptionKey = new TextEncoder().encode(secret);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encryptionKey);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, encryptionKey, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error: any) {
    throw new Error(`JWT verification failed: ${error.message}`);
  }
}
