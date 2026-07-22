# Example request

Run an uptime check with check_url. Alert only if status changed.

# Expected behavior

Call `check_url`. If `changed` is false (including the first baseline check where `previousStatus` is `unknown`), reply with exactly `No change.` If `changed` is true, send a short ALERT with the URL, new status, previous status, and check timestamp.
