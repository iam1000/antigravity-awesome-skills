# Residency+ G2 Stable Lock Workflow

## The Baseline Lock
The commit `9cb100b` (tagged as `g2-stable-lock-1`) represents the frozen rescue baseline for the Residency+ G2 application. This commit has been verified as structurally sound and stable for core UI boot and track rendering.

## Rules for Development
1. **No Direct Feature Work on the Lock:** Do not commit new features directly to the `rescue/g2-stable-rebuild` branch while at this tag.
2. **Branching:** Every future product slice or feature addition must branch off from the `g2-stable-lock-1` tag (or the latest verified stable main).
3. **Merging:** Branches should only be merged back into the main stable line after a successful smoke suite pass, ensuring the baseline is never dirtied with broken boot states.
4. **Fixture Hygiene:** Local development relies on `DEV_FIXTURE_MODE`. Fixture payloads must strictly conform to the frontend `shapeTrack` parser expectations (e.g., valid `permalink_url` strings).
5. **Autonomous Verification:** Do not improvise approval-gated `curl` prompts or request user babysitting. Verification checks must use the provided autonomous scripts:
   - **Local Dev:** Run `powershell ./scripts/verify_local_dev.ps1` while the local server is running.
   - **Production:** Run `powershell ./scripts/verify_prod.ps1`.
   - **Logs:** Both scripts output an execution summary and generate a timestamped `.log` file in the `logs/` directory. A zero exit code (`PASS`) indicates success. All future baseline checks or feature branch checks must use these scripts.
