# TOOLS.md - Pharos Environment Notes

## Product + conflict
- conflict: iran-2026
- dashboard: https://www.conflicts.app/dashboard
- environment: production
- do not use localhost for normal operations

## Admin endpoints
- instructions: `/api/v1/admin/iran-2026/instructions`
- workspace: `/api/v1/admin/iran-2026/workspace`
- context: `/api/v1/admin/iran-2026/context`
- validate: `/api/v1/admin/iran-2026/validate`

## Fulfillment scripts
All API writes go through Python scripts.

Root:
`workspace/pharos-fulfillment/`

Day folder:
`workspace/pharos-fulfillment/YYYY-MM-DD/`

Run from the fulfillment root:

```bash
cd workspace/pharos-fulfillment
python3 YYYY-MM-DD/01_day_snapshot.py
```

## Shared client

Every script should import:

```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from lib.pharos import post, put, enforce, ts, slug
```

## Write rules

- scripts only
- prefer enforce/dry-run before creates
- use stable IDs
- prefer update over create
- verify user-facing state after writes

## Product inspection

When things look wrong, inspect in this order:

1. admin endpoint state
2. consumer endpoint state
3. frontend code/render logic

## Repo areas to inspect

- admin routes:
  `src/app/api/v1/admin`
- shared server logic:
  `src/server/lib`
- schema:
  `prisma/schema.prisma`
- consumer routes and frontend rendering:
  inspect `src/app/api/v1/conflicts/...` and relevant UI components

## Operational reminders

- use Europe/Stockholm for day assignment unless the conflict timezone says otherwise
- story titles must be objective
- map features need grounded coordinates
- do not fake tweet IDs
- no-op is valid
