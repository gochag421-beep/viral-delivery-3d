import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { paymentSettings } from "../drizzle/schema";
import { getDb } from "./db";
import { ENV } from "./_core/env";

const PROVIDER = "revolut";
const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  if (!ENV.cookieSecret) throw new Error("JWT_SECRET is required to encrypt payment settings");
  return crypto.createHash("sha256").update(ENV.cookieSecret).digest();
}

export function encrypt(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function decrypt(value: string) {
  const [ivEncoded, tagEncoded, ciphertextEncoded] = value.split(".");
  if (!ivEncoded || !tagEncoded || !ciphertextEncoded) throw new Error("Invalid encrypted payment setting");
  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(ivEncoded, "base64url"));
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ciphertextEncoded, "base64url")), decipher.final()]).toString("utf8");
}

export function mask(value: string) {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export async function getPaymentSettingsSummary() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select().from(paymentSettings).where(eq(paymentSettings.provider, PROVIDER)).limit(1);
  const row = rows[0];
  if (!row) return { configured: false, provider: PROVIDER, secretKey: null, publicKey: null, webhookSecret: null };
  return {
    configured: true,
    provider: PROVIDER,
    secretKey: mask(decrypt(row.secretKeyCiphertext)),
    publicKey: mask(decrypt(row.publicKeyCiphertext)),
    webhookSecret: mask(decrypt(row.webhookSecretCiphertext)),
    updatedAt: row.updatedAt,
  };
}

export async function savePaymentSettings(input: { secretKey: string; publicKey: string; webhookSecret: string; updatedBy: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values = {
    provider: PROVIDER,
    secretKeyCiphertext: encrypt(input.secretKey.trim()),
    publicKeyCiphertext: encrypt(input.publicKey.trim()),
    webhookSecretCiphertext: encrypt(input.webhookSecret.trim()),
    updatedBy: input.updatedBy,
  };
  await db.insert(paymentSettings).values(values).onDuplicateKeyUpdate({ set: values });
  return getPaymentSettingsSummary();
}

export async function getDecryptedPaymentSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.select().from(paymentSettings).where(eq(paymentSettings.provider, PROVIDER)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    secretKey: decrypt(row.secretKeyCiphertext),
    publicKey: decrypt(row.publicKeyCiphertext),
    webhookSecret: decrypt(row.webhookSecretCiphertext),
  };
}

export function validatePaymentSettings(input: { secretKey: string; publicKey: string; webhookSecret: string }) {
  return [input.secretKey, input.publicKey, input.webhookSecret].every(value => value.trim().length >= 8);
}
