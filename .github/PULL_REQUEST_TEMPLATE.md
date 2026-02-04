# Pull Request Template

## Type
Select the type of change:
- [ ] `feat` - New feature
- [ ] `fix` - Bug fix
- [ ] `refactor` - Code refactoring
- [ ] `docs` - Documentation only
- [ ] `test` - Test addition/modification
- [ ] `chore` - Build process or library update
- [ ] `perf` - Performance improvement
- [ ] `ci` - CI configuration change

## Summary
<!-- Brief description of the changes -->

---

## Changes
<!-- Detailed description of what was changed -->

### Files Modified
<!-- List the files that were modified -->

---

## Related Issues
<!-- Related issue links (e.g., "Fixes #123") -->

---

## Test Plan
<!-- Check all that apply -->
- [ ] Unit tests written/updated (Target coverage: 80%+)
- [ ] Integration tests written/updated
- [ ] E2E tests written/updated (if applicable)
- [ ] All tests passing locally
- [ ] Manual testing completed
- [ ] No regression in existing functionality

### Test Commands
```bash
# Commands to run tests
npm run test
# or
npm run test:unit
npm run test:integration
```

---

## Screenshots
<!-- Attach screenshots if UI changes are involved -->
<!-- Before / After comparisons preferred -->

---

## Code Quality Checklist
- [ ] Code follows project conventions (see `CLAUDE.md`)
- [ ] No `console.log` left in production code
- [ ] Immutable patterns maintained (no direct mutations)
- [ ] Proper error handling with try/catch
- [ ] Input validation applied (Zod etc.)
- [ ] Accessibility attributes (role, aria-*) added where applicable
- [ ] Files are within size limits (200-400 lines ideal, max 800)
- [ ] Conventional Commits format used in commit messages

---

## Breaking Changes
<!-- List any breaking changes -->
- [ ] No breaking changes
- [ ] Breaking changes: <!-- Describe -->

---

## Additional Notes
<!-- Any additional context or considerations -->

---

## Reviewer Notes
<!-- Specific areas you want reviewers to focus on -->

---

### Deployment Notes (for Manager)
<!-- For Manager (Work A): Any special deployment considerations -->
