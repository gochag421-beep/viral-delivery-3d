# Revolut integration notes

Official Revolut Merchant documentation confirms that the embedded Checkout Widget aggregates card, Revolut Pay, Apple Pay, Google Pay, Pay by Bank, and other configured methods into one checkout. The server must create a Merchant API order and return its public token to the client widget. Revolut recommends using webhooks, rather than only the client success callback, to update the merchant order after payment completion.

Official webhook verification requires preserving the raw request payload. Build `payload_to_sign` as `v1.{Revolut-Request-Timestamp}.{raw-payload}`, compute HMAC-SHA256 with the webhook signing secret, compare against one of the `v1=` signatures in `Revolut-Signature`, and reject timestamps older than five minutes. Webhook events include `ORDER_COMPLETED`, `ORDER_PAYMENT_FAILED`, and `ORDER_PAYMENT_DECLINED`.

Sources:
- https://developer.revolut.com/docs/guides/merchant/introduction
- https://developer.revolut.com/docs/guides/merchant/accept-payments/online-payments/revolut-checkout/web
- https://developer.revolut.com/docs/guides/merchant/monitor-and-observe/webhooks/verify-the-payload-signature
- https://developer.revolut.com/docs/guides/merchant/monitor-and-observe/webhooks/using-webhooks
- https://developer.revolut.com/docs/guides/merchant/reference/order-lifecycle
