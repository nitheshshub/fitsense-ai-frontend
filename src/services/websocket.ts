import { EvaluationResult, SerialBridgeStatus, TelemetryPacket } from '../types';

export interface TelemetryWsMessage {
  type: 'TELEMETRY_UPDATE' | 'CONNECTION_ESTABLISHED';
  packet?: TelemetryPacket;
  evaluation?: EvaluationResult;
  bridgeStatus?: SerialBridgeStatus;
  message?: string;
}

type MessageCallback = (data: TelemetryWsMessage) => void;
type StatusCallback = (connected: boolean) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private currentWsUrl: string = 'wss://fitsense-ai-backend-vpak.onrender.com/ws/telemetry';
  private messageListeners: Set<MessageCallback> = new Set();
  private statusListeners: Set<StatusCallback> = new Set();
  private isConnecting: boolean = false;
  private reconnectInterval: any = null;

  public setWsUrl(url: string) {
    let wsUrl = url.replace(/^http/, 'ws').replace(/\/$/, '');
    if (!wsUrl.includes('/ws/telemetry')) {
      wsUrl += '/ws/telemetry';
    }
    this.currentWsUrl = wsUrl;
    this.reconnect();
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    try {
      this.ws = new WebSocket(this.currentWsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        console.log('[WS] Connected to live telemetry stream:', this.currentWsUrl);
        this.notifyStatus(true);
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: TelemetryWsMessage = JSON.parse(event.data);
          this.messageListeners.forEach(cb => cb(data));
        } catch (e) {
          console.warn('[WS] Error parsing WS payload:', e);
        }
      };

      this.ws.onclose = () => {
        this.notifyStatus(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[WS] Connection error:', err);
        this.notifyStatus(false);
      };
    } catch (e) {
      console.error('[WS] Failed to create WebSocket:', e);
      this.notifyStatus(false);
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.notifyStatus(false);
  }

  public reconnect() {
    this.disconnect();
    this.connect();
  }

  public onMessage(cb: MessageCallback): () => void {
    this.messageListeners.add(cb);
    return () => this.messageListeners.delete(cb);
  }

  public onStatus(cb: StatusCallback): () => void {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  private notifyStatus(connected: boolean) {
    this.statusListeners.forEach(cb => cb(connected));
  }

  private scheduleReconnect() {
    if (this.reconnectInterval) return;
    this.reconnectInterval = setInterval(() => {
      console.log('[WS] Retrying connection...');
      this.connect();
    }, 3000);
  }
}

export const wsClient = new WebSocketClient();
