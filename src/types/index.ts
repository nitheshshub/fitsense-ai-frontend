export interface SensorOrientation {
  roll: number;
  pitch: number;
  yaw: number;
}

export interface TelemetryPacket {
  timestamp: number;
  deviceId: string;
  sensor1: SensorOrientation;
  sensor2: SensorOrientation;
  flexionAngle: number;
  batteryLevel?: number;
  isSimulated?: boolean;
}

export type ExercisePhase = 'REST' | 'FLEXION' | 'PEAK_HOLD' | 'EXTENSION' | 'COMPLETED_REP';

export interface EvaluationResult {
  currentPhase: ExercisePhase;
  repCount: number;
  validReps: number;
  flexionAngle: number;
  targetRom: {
    min: number;
    max: number;
  };
  romAchieved: boolean;
  isValidForm: boolean;
  postureFlags: string[];
  consecutiveErrors: number;
  feedbackTrigger: {
    hapticPulse: boolean;
    buzzerBeep: boolean;
    audioVoicePromptCode: number | null;
    description?: string;
  };
  timestamp: number;
}

export type PatientStatus = 
  | 'Improving' 
  | 'Stable' 
  | 'Needs Attention' 
  | 'Recently Inactive' 
  | 'High Performing';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  injury: string;
  jointType: 'Knee' | 'Elbow' | 'Shoulder';
  status: PatientStatus;
  recoveryScore: number;
  targetRomMin: number;
  targetRomMax: number;
  assignedRepsPerSession: number;
  completedSessions: number;
  complianceRate: number;
  lastSessionDate: string;
  physicianName: string;
  notes: string;
}

export interface RecoveryScoreBreakdown {
  overallScore: number;
  accuracyWeight: number;
  romWeight: number;
  complianceWeight: number;
  accuracyScore: number;
  romScore: number;
  complianceScore: number;
  label: string;
}

export interface ExerciseSession {
  sessionId: string;
  patientId: string;
  startTime: string;
  endTime?: string;
  totalDurationSeconds: number;
  assignedReps: number;
  completedReps: number;
  validReps: number;
  targetRomMin: number;
  targetRomMax: number;
  maxFlexionAchieved: number;
  avgFlexionAchieved: number;
  scoreBreakdown: RecoveryScoreBreakdown;
}

export interface SerialBridgeStatus {
  connected: boolean;
  port: string | null;
  baudRate: number;
  isSimulating: boolean;
  lastPacketReceived?: string;
  packetsIngested: number;
}
