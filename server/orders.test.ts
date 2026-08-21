import { describe, expect, it, vi } from "vitest";

const { createOrder, createRevolutOrder } = vi.hoisted(() => ({
  createOrder: vi.fn(async (input: Record<string, unknown>) => ({ id: 42, ...input })),
  createRevolutOrder: vi.fn(async (input: { orderId: number }) => ({ id: "rev-order-42", token: "public-token-42", state: "pending", orderId: input.orderId })),
}));
vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, createOrder };
});
vi.mock("./revolut", () => ({ createRevolutOrder }));

import { appRouter } from "./routers";
import { shouldUpdateOrderStatus } from "./db";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("order status transitions", () => {
  it("does not downgrade a paid or completed order after a late failure event", () => {
    expect(shouldUpdateOrderStatus("paid", "cancelled")).toBe(false);
    expect(shouldUpdateOrderStatus("completed", "pending_payment")).toBe(false);
  });

  it("keeps repeated terminal events idempotent", () => {
    expect(shouldUpdateOrderStatus("paid", "paid")).toBe(false);
    expect(shouldUpdateOrderStatus("completed", "completed")).toBe(false);
    expect(shouldUpdateOrderStatus("pending_payment", "paid")).toBe(true);
  });
});

describe("order checkout", () => {
  it("validates the order and returns a public Revolut token", async () => {
    createOrder.mockClear();
    createRevolutOrder.mockClear();
    const caller = appRouter.createCaller(createContext());
    const result = await caller.orders.createCheckoutOrder({
      customerName: "Maria Papadopoulou",
      customerEmail: "maria@example.com",
      pickupAddress: "Kassianis 15, Ano Liosia",
      dropoffAddress: "Syntagma Square, Athens",
      itemDescription: "Small parcel",
      amountCents: 2500,
    });
    expect(result.token).toBe("public-token-42");
    expect(createOrder).toHaveBeenCalledWith(expect.objectContaining({ amountCents: 2500, currency: "EUR", customerId: null }));
    expect(createRevolutOrder).toHaveBeenCalledWith(expect.objectContaining({ orderId: 42, amountCents: 2500, currency: "EUR" }));
  });

  it("rejects an amount below one euro", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.orders.createCheckoutOrder({
      customerName: "Maria Papadopoulou",
      customerEmail: "maria@example.com",
      pickupAddress: "Kassianis 15, Ano Liosia",
      dropoffAddress: "Syntagma Square, Athens",
      itemDescription: "Small parcel",
      amountCents: 50,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
