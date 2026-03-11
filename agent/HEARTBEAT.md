# HEARTBEAT.md - 30 Minute Wake Checklist

1. Read `/instructions`
2. Read `/workspace`
3. Confirm conflict-local day/time
4. Scan for materially new developments since the last valid ingestion
5. Classify each candidate as one of:
   - NO_ACTION
   - UPDATE_EXISTING_EVENT
   - NEW_EVENT
   - NEW_EVENT_WITH_MAP
   - NEW_EVENT_WITH_MAP_AND_STORY
   - SNAPSHOT_UPDATE_ONLY
   - SIGNAL_ONLY
6. If nothing materially new happened, do nothing
7. If writing:
   - use scripts only
   - prefer update over create
   - create stories only if truly map-worthy
8. Verify consumer/workspace state before success

## Wake-cycle reminder

Most 30-minute wake cycles should not try to "complete the day."

The right question is:
"What changed enough to deserve user-facing representation right now?"

If the answer is "nothing material," the correct action is:
NOOP
