import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.SECRET;
const encryptionKey = new TextEncoder().encode(secret);

export async function encrypt(payload: any) {
  if (typeof payload !== 'object') {
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    } else {
      payload = toPlainObject(payload);
    }
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(encryptionKey)
    .catch();
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

function toPlainObject(obj: any): Record<string, any> {
  const plainObject: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value !== 'function') {
        plainObject[key] = value;
      }
    }
  }
  return plainObject;
}
