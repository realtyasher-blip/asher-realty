# Asher Realty AI Calling

The protected workspace is available at `/crm/calling` after CRM login.

## Available now

- Explicit calling-permission capture on consultation and site-visit forms
- Consent verification and do-not-call suppression in the CRM
- Project-specific review queues
- Structured response capture, automatic lead scoring and prospect classification
- Follow-up and site-visit updates in the existing lead record
- Transcript and recording-reference fields
- Excel export with calling outcomes, scores and consent status
- Contact import from `.xlsx` or `.csv` files containing only Name and Number
- Priority-sorted queues with Eligible, Hot, Follow-up, Unreached and Suppressed views
- Campaign preflight for language, objective, project, calling hours and attempt limits
- Transparent, project-aware conversation openers that can be copied by an advisor
- Live intent-score preview, next-best action and automatic handoff guidance
- Per-lead call history with outcomes, classifications, scores, objections and summaries
- Calling-funnel metrics for attempts, answer rate, hot prospects and site-visit conversion
- Daily AI briefing with one-click Ready, New, Hot and Follow-up queues
- Guided five-stage conversation flow from permission through next action
- Real-time objection coaching for price, location, timing, trust and finance concerns
- A 100-point call-quality checklist covering permission, disclosure, summary,
  qualification and the agreed next action
- A production-readiness panel for OpenAI Realtime, signed webhooks, Exotel,
  caller identity, the SIP call flow and human transfer
- A single-call activation gate with calling-hour, suppression, consent,
  concurrency and two-attempt enforcement
- Signed OpenAI Realtime SIP acceptance and signed Exotel status callbacks
- Manual live transfer of an active AI call to the configured human advisor
- Automatic matching or creation of a protected CRM lead for an inbound caller

Imported contacts are deduplicated against existing CRM phone numbers and are
marked “Not verified” for calling permission. Verify the permission source in
the calling workspace before adding an imported contact to a queue.

## Production activation gate

Public automated calling intentionally remains disabled until all of these are complete:

1. A registered Exotel account, approved caller identity and applicable India calling series
2. OpenAI API access with the Realtime model configured
3. A reviewed disclosure script that identifies the virtual assistant
4. Proven consent provenance for every callable lead
5. DND and internal suppression checks before each attempt
6. Approved calling hours, retry limits, recording notice and retention policy
7. Human handoff and site-visit calendar integration

Set `AI_CALLING_ENABLED=true` only after the gate is complete. The CRM will expose
one controlled test-call button only when all readiness checks pass and the
selected lead has recorded permission. There is intentionally no bulk-call button.

## Provider connection

### 1. OpenAI Realtime

1. Create or select the OpenAI API project used only for Asher Realty voice.
2. Add the production webhook endpoint:
   `https://www.asherrealty.in/api/webhooks/openai/realtime`
3. Subscribe it to `realtime.call.incoming` and copy the webhook signing secret.
4. Configure the OpenAI SIP destination for that project in the Exotel trunk.
5. Use a server-only API key with the minimum permissions required for Realtime.

The server verifies every OpenAI webhook before accepting a SIP call. The
accepted session uses `gpt-realtime-2.1`, the `marin` voice, semantic turn
detection, input transcription and the Asher Realty disclosure/safety prompt.

### 2. Exotel

1. Complete Exotel business onboarding and obtain an approved ExoPhone/caller ID.
2. Create an ExoTrunk that routes to the OpenAI SIP destination.
3. In App Bazaar, create a flow that connects answered outbound calls to that trunk.
4. Copy the saved flow URL, API key, API token and account SID.
5. If recording is enabled in the flow, approve the spoken recording notice,
   access controls and retention period before the first call.

Exotel status callbacks are sent to:
`https://www.asherrealty.in/api/webhooks/exotel/call-status`

The application appends a secret token to that callback URL. Provider status,
call SID and any recording reference are attached to the lead's protected CRM
record; secrets are never returned to the browser.

### 3. Vercel environment variables

Add the following Production variables and redeploy:

```text
AI_CALLING_ENABLED=false
OPENAI_API_KEY=...
OPENAI_WEBHOOK_SECRET=...
OPENAI_REALTIME_MODEL=gpt-realtime-2.1
OPENAI_REALTIME_VOICE=marin
EXOTEL_API_KEY=...
EXOTEL_API_TOKEN=...
EXOTEL_ACCOUNT_SID=...
EXOTEL_CALLER_ID=...
EXOTEL_SUBDOMAIN=api.in.exotel.com
EXOTEL_FLOW_URL=...
VOICE_WEBHOOK_SECRET=...
AI_HUMAN_TRANSFER_NUMBER=+919019697170
NEXT_PUBLIC_SITE_URL=https://www.asherrealty.in
```

Generate `VOICE_WEBHOOK_SECRET` as a long random value. Keep
`AI_CALLING_ENABLED=false` while the CRM readiness panel is being checked. Set it
to `true` only for the controlled test after all other items show ready.

## First-call procedure

1. Use a test lead controlled by the business owner or a team member.
2. Record the permission source in the CRM.
3. Select the lead in `/crm/calling` and review every readiness item.
4. Confirm the single-call acknowledgement and start one call.
5. Verify that Aira discloses that it is an AI assistant and asks permission.
6. Test interruption handling, an opt-out, an unknown-price question and a
   request for a human advisor.
7. Confirm the Exotel status appears in the lead record and the advisor transfer works.
8. Review the recording only if recording was disclosed and approved.

Do not activate lead campaigns until this test is reviewed for accuracy,
latency, disclosure, pronunciation, call quality, opt-out handling and transfer.

## Recommended opening

“Hi, I’m Asher Realty’s virtual property assistant. You recently asked us about
property options in Bengaluru. Is this a convenient time for a brief call?”

The assistant must not claim to be human. A prospect who says “stop”, “do not
call”, or withdraws permission must be suppressed immediately.

## Conversation and handoff rules

- Keep turns short and ask one question at a time.
- Confirm what the buyer said before recommending a project.
- Use only approved project and CRM data; never invent inventory, prices, offers,
  possession dates or legal claims.
- Offer a human handoff whenever the buyer requests one.
- Handoff immediately for high-intent leads, site-visit requests, negotiation,
  final pricing, RERA or legal questions, loans, agreements, complaints or distress.
- Send a short WhatsApp recap after a useful conversation and record the agreed
  next action in the CRM.
