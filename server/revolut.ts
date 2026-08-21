import crypto from "node:crypto";
import { attachRevolutOrder, updateOrderStatusByRevolutId } from "./db";
import { getDecryptedPaymentSettings } from "./paymentSettings";

const REVOLUT_API_URL = "https://merchant.revolut.com/api";

export async function createRevolutOrder(input: { orderId: number; amountCents: number; currency: string; description: string }) {
  const settings = await getDecryptedPaymentSettings();
  if (!settings) throw new Error("Revolut payment settings are not configured");

  const response = await fetch(`${REVOLUT_API_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.secretKey}`,
      "Content-Type": "application/json",
      "Revolut-Api-Version": "2024-09-01",
    },
    body: JSON.stringify({
      amount: input.amountCents,
      currency: input.currency,
      description: input.description,
      merchant_order_ext_ref: `FASTMOVMENT-${input.orderId}`,
      capture_mode: "AUTOMATIC",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Revolut order creation failed (${response.status}): ${details.slice(0, 300)}`);
  }

  const order = await response.json() as { id?: string; token?: string; state?: string };
  if (!order.id || !order.token) throw new Error("Revolut returned an incomplete order");
  await attachRevolutOrder(input.orderId, order.id, order.token);
  return { id: order.id, token: order.token, state: order.state ?? "pending" };
}

function isTimestampFresh(timestamp: string) {
  const value = Number(timestamp);
  if (!Number.isFinite(value)) return false;
  return Math.abs(Date.now() - value) <= 5 * 60 * 1000;
}

export async function verifyRevolutWebhook(rawPayload: string, timestamp: string, signatureHeader: string) {
  if (!isTimestampFresh(timestamp)) return false;
  const settings = await getDecryptedPaymentSettings();
  if (!settings) return false;
  const expectedPayload = `v1.${timestamp}.${rawPayload}`;
  const expected = crypto.createHmac("sha256", settings.webhookSecret).update(expectedPayload).digest("hex");
  return signatureHeader.split(",").some(signature => {
    const [version, value] = signature.trim().split("=");
    if (version !== "v1" || !value || value.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  });
}

export async function handleRevolutWebhook(payload: { event?: string; order_id?: string }) {
  if (!payload.order_id) return;
  const statusByEvent: Record<string, "paid" | "pending_payment" | "cancelled"> = {
    ORDER_COMPLETED: "paid",
    ORDER_PAYMENT_FAILED: "cancelled",
    ORDER_PAYMENT_DECLINED: "cancelled",
  };
  const status = payload.event ? statusByEvent[payload.event] : undefined;
  if (status) await updateOrderStatusByRevolutId(payload.order_id, status);
}
