import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { z } from "zod";
import { getDecryptedPaymentSettings, getPaymentSettingsSummary, savePaymentSettings, validatePaymentSettings } from "./paymentSettings";
import { createOrder } from "./db";
import { createRevolutOrder } from "./revolut";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  orders: router({
    checkoutConfig: publicProcedure.query(async () => {
      const settings = await getDecryptedPaymentSettings();
      return { configured: Boolean(settings), publicKey: settings?.publicKey ?? null, mode: "prod" as const };
    }),
    createCheckoutOrder: publicProcedure
      .input(z.object({
        customerName: z.string().min(2).max(160),
        customerEmail: z.string().email().max(320),
        pickupAddress: z.string().min(5).max(2000),
        dropoffAddress: z.string().min(5).max(2000),
        itemDescription: z.string().min(2).max(4000),
        amountCents: z.number().int().min(100).max(1000000),
      }))
      .mutation(async ({ input, ctx }) => {
        const order = await createOrder({ ...input, currency: "EUR", customerId: ctx.user?.id ?? null });
        if (!order) throw new Error("Could not create order");
        return createRevolutOrder({
          orderId: order.id,
          amountCents: input.amountCents,
          currency: "EUR",
          description: `FASTMOVMENT delivery request #${order.id}`,
        });
      }),
  }),

  paymentSettings: router({
    summary: adminProcedure.query(() => getPaymentSettingsSummary()),
    save: adminProcedure
      .input(z.object({
        secretKey: z.string().min(8),
        publicKey: z.string().min(8),
        webhookSecret: z.string().min(8),
      }))
      .mutation(({ input, ctx }) => {
        if (!validatePaymentSettings(input)) throw new Error("All payment credentials are required");
        return savePaymentSettings({ ...input, updatedBy: ctx.user.id });
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
