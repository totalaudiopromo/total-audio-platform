## Deployment Reliability Plan (Monorepo)

### Current Pain Point

- Deploying from `apps/tracker` with `vercel deploy` only uploads that subdirectory, so the shared workspace package `packages/ui` is missing at build time, producing `Module not found: Can't resolve '@total-audio/ui'` during production builds.

### Best-Practice Strategy

1. **Deploy From Monorepo Root**

   - Run `vercel deploy apps/tracker --prod --yes` (note the path argument) or update the root script `deploy:tracker` to do the same.
   - This uploads the whole repository while still building the Tracker app, so Vercel can install `@total-audio/ui` via the `file:` workspace link.

2. **Prefer Git-Based Deployments**

   - Connect the repository to Vercel and set the project’s root directory to `apps/tracker`.
   - Git deployments automatically include every workspace package, avoid CLI packaging drift, and keep environment variables in sync.

3. **Lockfile & Workspace Hygiene**

   - Use one lockfile at the repo root, commit it, and avoid running `npm install` inside subpackages.
   - When dependencies change, run installs from the root so `packages/ui` stays in the dependency graph for every app.

4. **Preflight Checks**

   - Add CI or a pre-deploy script that runs:
     ```bash
     npm run build --workspace=apps/tracker
     ```
     This fails locally if shared packages are missing before the deploy command runs.

5. **Cron Configuration**
   - Keep Hobby-compatible schedules (currently set to `0 0 * * *` in `apps/tracker/vercel.json`).
   - If more frequent jobs are needed, move them to an external scheduler or upgrade the Vercel plan ahead of time.

### Optional Enhancements

- Introduce a task runner (Turborepo/Nx) to orchestrate builds and cache outputs across apps.
- Publish `@total-audio/ui` to a private registry (e.g., GitHub Packages) if you ever need to deploy Tracker independently of the monorepo root.

### Next Steps

- Update local deploy workflow to run from the monorepo root (Step 1).
- Migrate Tracker to Git-based Vercel deployments to remove manual CLI deploys.
- Monitor the next production deploy to confirm the missing-module error is resolved.
