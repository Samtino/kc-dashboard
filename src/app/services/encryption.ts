import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.SECRET;
const key = new TextEncoder().encode(secret);

export async function encrypt(payload: any) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error: any) {
    throw new Error(`JWT verification failed: ${error.message}`);
  }
}
