# Maintenance Scripts

Scripts are grouped by intent so they can be run without being mistaken for
Hugo runtime code:

- `generate/`: one-off generators for course content and diagrams.
- `validation/`: checks that inspect source assets without changing the site.

Run scripts from the repository root unless a script documents another
entrypoint. Validation scripts resolve the repository root from their own file
location where possible.
