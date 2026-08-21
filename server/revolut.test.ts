import crypto from "node:crypto";
import { describe, expect, it, vi } from "vitest";

const { updateOrderStatusByRevolutId } = vi.hoisted(() => ({ updateOrderStatusByRevolutId: vi.fn() }));
vi.mock("./paymentSettings", () => ({
  getDecryptedPaymentSettings: vi.fn(async () => ({ secretKey: "secret-key", publicKey: "public-key", webhookSecret: "webhook-secret" })),
}));
vi.mock("./db", () => ({
  attachRevolutOrder: vi.fn(),
  updateOrderStatusByRevolutId,
}));

import { handleRevolutWebhook, verifyRevolutWebhook } from "./revolut";

describe("Revolut webhooks", () => {
  it("accepts a fresh HMAC signature and rejects a stale timestamp", async () => {
    const timestamp = String(Date.now());
    const payload = JSON.stringify({ event: "ORDER_COMPLETED", order_id: "rev-order-1" });
    const signed = `v1.${timestamp}.${payload}`;
    const digest = crypto.createHmac("sha256", "webhook-secret").update(signed).digest("hex");
    expect(await verifyRevolutWebhook(payload, timestamp, `v1=${digest}`)).toBe(true);
    expect(await verifyRevolutWebhook(payload, String(Date.now() - 10 * 60 * 1000), `v1=${digest}`)).toBe(false);
  });

  it("maps terminal webhook events to order status updates", async () => {
    updateOrderStatusByRevolutId.mockClear();
    await handleRevolutWebhook({ event: "ORDER_COMPLETED", order_id: "rev-order-1" });
    expect(updateOrderStatusByRevolutId).toHaveBeenCalledWith("rev-order-1", "paid");
    await handleRevolutWebhook({ event: "ORDER_PAYMENT_DECLINED", order_id: "rev-order-1" });
    expect(updateOrderStatusByRevolutId).toHaveBeenCalledWith("rev-order-1", "cancelled");
  });
});
