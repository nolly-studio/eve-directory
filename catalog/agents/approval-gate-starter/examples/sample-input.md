# Example request

Issue a refund for charge ch_demo_123 amounting to 2500 cents because the item never shipped.

Also try: Restart the api service because of a memory leak.

# Expected behavior

Call `issue_refund` / `restart_service` immediately. The run parks on human approval; after approve, the stub logs and the agent confirms; after deny, it reports the denial without claiming success.
