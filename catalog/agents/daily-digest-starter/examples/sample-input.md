# Example request

Fetch today's feed with fetch_source and post the daily digest.

# Expected behavior

Call `fetch_source`, pick the 5 most substantive items from the returned feed XML, and reply in the digest format: a dated header followed by five numbered lines, each with the item title, one line of why it matters, and the link. No invented items.
