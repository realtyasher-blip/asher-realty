import { NextRequest, NextResponse } from "next/server";

import {
  attachOpenAICall,
  buildVoiceInstructions,
  getVoiceReadiness,
  openAIClient,
  recordInboundOpenAICall,
  resolveVoiceLead,
} from "@/lib/crm/voice";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  try {
    const client = openAIClient();
    const event = await client.webhooks.unwrap(payload, request.headers);
    if (event.type !== "realtime.call.incoming") {
      return NextResponse.json({ received: true });
    }

    if (!getVoiceReadiness().ready) {
      await client.realtime.calls.reject(event.data.call_id, { status_code: 503 });
      return NextResponse.json({ received: true, accepted: false });
    }

    const context = await resolveVoiceLead(event.data.sip_headers);
    await client.realtime.calls.accept(event.data.call_id, {
      type: "realtime",
      model: process.env.OPENAI_REALTIME_MODEL?.trim() || "gpt-realtime-2.1",
      instructions: buildVoiceInstructions(context.lead, context.direction),
      output_modalities: ["audio"],
      max_output_tokens: 220,
      audio: {
        input: {
          noise_reduction: { type: "far_field" },
          transcription: { model: "gpt-4o-mini-transcribe", language: "en" },
          turn_detection: { type: "semantic_vad", eagerness: "low", create_response: true, interrupt_response: true },
        },
        output: {
          voice: process.env.OPENAI_REALTIME_VOICE?.trim() || "marin",
          speed: 0.96,
        },
      },
      tracing: { workflow_name: "Asher Realty consent-led property call" },
    });
    if (context.lead && context.providerCall) {
      await attachOpenAICall(context.lead, context.providerCall, event.data.call_id);
    } else if (context.lead) {
      await recordInboundOpenAICall(context.lead, event.data.call_id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("OpenAI Realtime webhook rejected", error instanceof Error ? error.message : error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
