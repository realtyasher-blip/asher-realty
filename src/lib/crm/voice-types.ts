export type VoiceReadinessKey =
  | "activation"
  | "openai"
  | "openaiWebhook"
  | "telephony"
  | "callerId"
  | "callFlow"
  | "statusWebhook"
  | "humanTransfer";

export type VoiceReadinessCheck = {
  key: VoiceReadinessKey;
  label: string;
  ready: boolean;
  detail: string;
};

export type VoiceReadiness = {
  ready: boolean;
  safeMode: boolean;
  model: string;
  voice: string;
  checks: VoiceReadinessCheck[];
};

export type TestCallResult = {
  callId: string;
  status: string;
  message: string;
};
