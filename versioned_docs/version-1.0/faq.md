---
sidebar_position: 99
---

# FAQ

## Why does GitHub Actions show Node.js deprecation warnings?

Some GitHub-maintained Pages actions still reference older runtimes internally.
If your workflow is green, deployment is still successful.

## How do I preview my doc changes?

Run:

```bash
npm run start
```

Then open `http://localhost:3000`.

## How do I verify before pushing?

Run:

```bash
npm run build
```

This catches broken links and build issues early.
