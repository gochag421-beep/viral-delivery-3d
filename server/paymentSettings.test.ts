import { describe, expect, it, vi } from "vitest";

const databaseState: { row?: Record<string, unknown> } = {};
const fakeDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        limit: async () => (databaseState.row ? [databaseState.row] : []),
      }),
    }),
  }),
  insert: () => ({
    values: (values: Record<string, unknown>) => ({
      onDuplicateKeyUpdate: async () => {
        databaseState.row = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...values };
      },
    }),
  }),
};

vi.mock("./db", () => ({ getDb: vi.fn(async () => fakeDb) }));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { decrypt, encrypt, getPaymentSettingsSummary, mask, savePaymentSettings, validatePaymentSettings } from "./paymentSettings";

type TestUser = NonNullable<TrpcContext["user"]>;

function createContext(user: TestUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("payment settings security", () => {
  it("accepts complete Revolut credentials", () => {
    expect(validatePaymentSettings({ secretKey: "sk_test_revolut_123456", publicKey: "pk_test_revolut_123456", webhookSecret: "whsec_revolut_123456" })).toBe(true);
  });

  it("rejects missing or too-short credentials", () => {
    expect(validatePaymentSettings({ secretKey: "", publicKey: "public", webhookSecret: "secret" })).toBe(false);
    expect(validatePaymentSettings({ secretKey: "secret", publicKey: "", webhookSecret: "secret" })).toBe(false);
    expect(validatePaymentSettings({ secretKey: "secret", publicKey: "public", webhookSecret: "" })).toBe(false);
  });

  it("encrypts credentials and returns only a masked representation", () => {
    const plaintext = "sk_live_revolut_super_secret_123";
    const ciphertext = encrypt(plaintext);
    expect(ciphertext).not.toContain(plaintext);
    expect(decrypt(ciphertext)).toBe(plaintext);
    expect(mask(plaintext)).toBe("sk_l••••_123");
  });

  it("persists ciphertext and returns masked values from the summary", async () => {
    databaseState.row = undefined;
    const saved = await savePaymentSettings({
      secretKey: "sk_live_revolut_super_secret_123",
      publicKey: "pk_live_revolut_public_123",
      webhookSecret: "whsec_live_revolut_webhook_123",
      updatedBy: 1,
    });
    expect(databaseState.row?.secretKeyCiphertext).not.toBe("sk_live_revolut_super_secret_123");
    expect(databaseState.row?.publicKeyCiphertext).not.toBe("pk_live_revolut_public_123");
    expect(databaseState.row?.webhookSecretCiphertext).not.toBe("whsec_live_revolut_webhook_123");
    expect(saved.secretKey).toBe("sk_l••••_123");
    expect(saved.publicKey).toBe("pk_l••••_123");
    expect(saved.webhookSecret).toBe("whse••••_123");
    expect((await getPaymentSettingsSummary()).configured).toBe(true);
  });

  it("denies non-admin access before touching payment storage", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 7,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.paymentSettings.summary()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
