# Admin Portal Release Checklist (v7.5)

## Pre-merge
- [ ] All feature branches reviewed and approved
- [ ] CI green (lint, build, tests)
- [ ] Database migrations reviewed

## Staging
- [ ] Deploy backend and frontend
- [ ] Run `npx prisma migrate deploy`
- [ ] Seed admin data (if needed): `npm run db:seed`
- [ ] Smoke test admin routes: themes, users, audit-logs, security, analytics
- [ ] Verify ThemeSyncProvider loads tokens

## Production
- [ ] Tag release (v7.5.0-admin-portal)
- [ ] Deploy
- [ ] Verify health endpoints and logs

## Rollback Plan
- [ ] Git revert release commits
- [ ] Prisma migrate resolve (if needed)
- [ ] Restore DB from latest backup

## Post-deploy
- [ ] Monitor error rates
- [ ] Validate admin flows
- [ ] Create follow-up tasks for Phase 3 enhancements