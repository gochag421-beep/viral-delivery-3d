# Current task

Add an administrator-only payment settings page where Revolut credentials can be entered securely through the website.

- [x] Design the secure payment-settings flow.
- [x] Implement masked admin payment settings.
- [x] Test access control and secure secret handling.
- [x] Publish the payment-settings update.

- [x] Add tests proving non-admin users are denied by payment settings procedures.
- [x] Add tests proving saved credentials are encrypted at rest and summary responses are masked.
- [x] Verify signed-out browser access to the payment settings page; non-admin denial is covered by the router test.
