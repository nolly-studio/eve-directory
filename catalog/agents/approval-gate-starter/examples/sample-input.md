# Example request

Issue a refund for charge ch_demo_123 amounting to 2500 cents because the item never shipped.

# Expected behavior

Call `issue_refund` immediately. The run parks on human approval; after approve, the stub logs and the agent confirms; after deny, it reports the denial without claiming a refund happened.
