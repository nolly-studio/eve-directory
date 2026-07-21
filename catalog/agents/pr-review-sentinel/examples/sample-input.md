# Example request

Review this pull request: it adds a password-reset endpoint, changes the users table migration, and refactors the mailer. The linked issue only covers password reset. Here is the diff. Our conventions doc says handlers must validate input with zod and never log tokens.

# Expected behavior

Follow the agent workflow: flag the scope creep (mailer refactor), scrutinize the auth surface and migration, check the token-logging convention, list test gaps, and end with a severity-ordered draft review awaiting approval before anything is posted.
