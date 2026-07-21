# Team conventions

Edit this file with the conventions the reviewer should enforce. Only rules listed here (or enforced by the repo's linters) are in scope.

## Blocking

- Authentication and authorization changes require tests
- Migrations must be backwards-compatible or include a rollback note

## Non-blocking

- Prefer named exports over default exports for new modules
