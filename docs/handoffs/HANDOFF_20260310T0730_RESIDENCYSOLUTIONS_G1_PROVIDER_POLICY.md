# HANDOFF — ResidencySolutions G1 Provider Allowlist
**Timestamp:** 2026-03-10T07:30:00-04:00 (2026-03-10T11:30:00Z)
**Commit:** `06bd3cd`
**Repo:** `G:\DOWNLOADS5\reidchunes\residencysolutions-core`

---

## What Was Done
Added a strict provider allowlist and source normalization rules to the G1 entitlements core without any UI bloat. 

**Files Updated / Created:**
- `docs/PROVIDER_POLICY.md` (NEW: Defines canonical lowercase values and override flags)
- `docs/ENTITLEMENTS_SPEC.md` (UPDATED: Documented the `provider` field and new lowercase source formats)
- `scripts/entitlements.ps1` (UPDATED: Added normalization, allowlist enforcement, and explicit overrides)
- `scripts/verify-core.ps1` (UPDATED: Enhanced tests to assert on proper override failure/success modes)

---

## Sanitized Verification Summary
| Check | Result |
|---|---|
| `guard-no-ui.ps1` | **PASS**: No UI paths touched |
| Native Normalize | **PASS**: `sTrIpe` + `AdMiN` successfully normalized to lowercase canonical |
| Unknown Fail | **PASS**: Unknown provider (`unknown_p`) and unknown source correctly rejected by default |
| Override Flags | **PASS**: `-AllowUnknownProvider` and `-AllowUnknownSource` bypassed validation correctly |
| `git status` | **CLEAN**: Only intended files modified |

---

## Rollback Plan
If validation breaks unexpectedly downstream:
1. Revert commit `06bd3cd`.
2. This will remove strict validation from `entitlements.ps1` and restore permissive string parsing.
3. Push to `main`. No downstream data migration needed as logs are JSONL.

---

## Next Atomic Task
> **G2: Add lightweight analytics/error telemetry spec for G2 wrapper endpoints**, OR
> **G1: Add a small persisted adapter plan for G1 beyond JSONL.**
