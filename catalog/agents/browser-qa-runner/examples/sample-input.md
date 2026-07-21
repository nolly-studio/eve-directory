# Example request

We deployed to staging at https://staging.example.com an hour ago. Run the signup flow (email + password, test inbox provided), the checkout flow with Stripe test card 4242 4242 4242 4242, and password reset. Yesterday checkout worked. File anything broken.

# Expected behavior

Follow the agent workflow: confirm scope and credentials, run each flow step by step with captured evidence, retry failures once, classify flaky versus consistent, and end with a pass/fail matrix plus draft bug reports awaiting approval before filing.
