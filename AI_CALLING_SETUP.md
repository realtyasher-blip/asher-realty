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

Set `AI_CALLING_ENABLED=true` only after the gate is complete. The current UI still
requires an activation review even when provider credentials are detected.

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
