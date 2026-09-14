// Ensures encryption-based tests (paymentSettings) have a stable secret.
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "vitest-jwt-secret-for-local-tests";