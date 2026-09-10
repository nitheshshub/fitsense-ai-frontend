import { Patient, SerialBridgeStatus, TelemetryPacket } from '../types';

let currentApiBaseUrl = 'https://fitsense-ai-backend-vpak.onrender.com';

export function setApiBaseUrl(url: string) {
  currentApiBaseUrl = url.replace(/\/$/, '');
}

export function getApiBaseUrl(): string {
  return currentApiBaseUrl;
}

export async function fetchHealthStatus() {
  const res = await fetch(`${currentApiBaseUrl}/api/health`);
  return res.json();
}

export async function fetchPatients(status?: string, query?: string): Promise<{ success: boolean; patients: Patient[]; statusCounts: Record<string, number> }> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (query) params.append('query', query);

  const res = await fetch(`${currentApiBaseUrl}/api/patients?${params.toString()}`);
  return res.json();
}

export async function fetchPatientById(id: string): Promise<{ success: boolean; patient: Patient }> {
  const res = await fetch(`${currentApiBaseUrl}/api/patients/${id}`);
  return res.json();
}

export async function fetchLatestTelemetry(): Promise<{ success: boolean; latestPacket: TelemetryPacket; evaluation: any }> {
  const res = await fetch(`${currentApiBaseUrl}/api/telemetry/latest`);
  return res.json();
}

export async function fetchBridgeStatus(): Promise<{ success: boolean; bridgeStatus: SerialBridgeStatus }> {
  const res = await fetch(`${currentApiBaseUrl}/api/bridge/status`);
  return res.json();
}

export async function toggleSimulationMode(simulate: boolean): Promise<{ success: boolean; message: string; status: SerialBridgeStatus }> {
  const res = await fetch(`${currentApiBaseUrl}/api/bridge/mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulate })
  });
  return res.json();
}

export async function startExerciseSession(patientId: string, minRom?: number, maxRom?: number) {
  const res = await fetch(`${currentApiBaseUrl}/api/sessions/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, targetRomMin: minRom, targetRomMax: maxRom })
  });
  return res.json();
}

export async function endExerciseSession() {
  const res = await fetch(`${currentApiBaseUrl}/api/sessions/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function resetSessionCounters() {
  const res = await fetch(`${currentApiBaseUrl}/api/sessions/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}
