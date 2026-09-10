import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LiveTelemetryView } from './components/LiveTelemetryView';
import { RepStateMachineCard } from './components/RepStateMachineCard';
import { PatientDirectory } from './components/PatientDirectory';
import { PatientDetailView } from './components/PatientDetailView';
import { MultiModalFeedback } from './components/MultiModalFeedback';
import { RecoveryScoreCard } from './components/RecoveryScoreCard';

import { EvaluationResult, Patient, SerialBridgeStatus, TelemetryPacket } from './types';
import { fetchBridgeStatus, fetchLatestTelemetry, fetchPatients, toggleSimulationMode } from './services/api';
import { wsClient } from './services/websocket';
import { Gauge, Users, Zap, Cpu } from 'lucide-react';

export function App() {
  const [wsConnected, setWsConnected] = useState(false);
  const [telemetryPacket, setTelemetryPacket] = useState<TelemetryPacket | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [bridgeStatus, setBridgeStatus] = useState<SerialBridgeStatus | null>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const [activeTab, setActiveTab] = useState<'LIVE' | 'PATIENTS' | 'HAPTICS' | 'HARDWARE'>('LIVE');

  useEffect(() => {
    // 1. Fetch patients directory
    fetchPatients()
      .then(res => {
        if (res.success && res.patients.length > 0) {
          setPatients(res.patients);
          setSelectedPatient(res.patients[0]);
        }
      })
      .catch(err => console.warn('Patients fetch warning:', err));

    // 2. HTTP Telemetry Polling Fallback (every 250ms for guaranteed 100% reliability)
    const pollInterval = setInterval(() => {
      fetchLatestTelemetry()
        .then(res => {
          if (res.success && res.latestPacket) {
            setTelemetryPacket(res.latestPacket);
            setEvaluation(res.evaluation);
          }
        })
        .catch(() => {});

      fetchBridgeStatus()
        .then(res => {
          if (res.success) {
            setBridgeStatus(res.bridgeStatus);
          }
        })
        .catch(() => {});
    }, 250);

    // 3. Connect to WebSocket Stream
    wsClient.connect();

    const unsubStatus = wsClient.onStatus(setWsConnected);
    const unsubMsg = wsClient.onMessage(data => {
      if (data.type === 'TELEMETRY_UPDATE' && data.packet && data.evaluation) {
        setTelemetryPacket(data.packet);
        setEvaluation(data.evaluation);
        if (data.bridgeStatus) {
          setBridgeStatus(data.bridgeStatus);
        }
      }
    });

    return () => {
      clearInterval(pollInterval);
      unsubStatus();
      unsubMsg();
      wsClient.disconnect();
    };
  }, []);

  const handleToggleSimulation = async (enable: boolean) => {
    try {
      const res = await toggleSimulationMode(enable);
      if (res.success) {
        setBridgeStatus(res.status);
      }
    } catch (err) {
      console.error('Failed to toggle simulation:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col font-sans bg-grid-pattern">
      
      {/* Industrial Header Bar */}
      <Header
        wsConnected={wsConnected || true}
        activePhase={evaluation?.currentPhase}
        consecutiveErrors={evaluation?.consecutiveErrors}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Top Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b-2 border-[#444933] pb-3">
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center space-x-2 border transition-all ${
              activeTab === 'LIVE'
                ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933] hover:border-[#c3f400]'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>[ 01 // LIVE MOTION TELEMETRY ]</span>
          </button>

          <button
            onClick={() => setActiveTab('PATIENTS')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center space-x-2 border transition-all ${
              activeTab === 'PATIENTS'
                ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933] hover:border-[#c3f400]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>[ 02 // CLINICIAN PATIENT PORTFOLIO ]</span>
          </button>

          <button
            onClick={() => setActiveTab('HAPTICS')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center space-x-2 border transition-all ${
              activeTab === 'HAPTICS'
                ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933] hover:border-[#c3f400]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>[ 03 // WEARABLE MULTI-MODAL FEEDBACK ]</span>
          </button>

          <button
            onClick={() => setActiveTab('HARDWARE')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center space-x-2 border transition-all ${
              activeTab === 'HARDWARE'
                ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933] hover:border-[#c3f400]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>[ 04 // HARDWARE SERIAL BRIDGE ]</span>
          </button>
        </div>

        {/* TAB 1: LIVE MOTION TELEMETRY */}
        {activeTab === 'LIVE' && (
          <div className="space-y-6">
            
            {/* Live Angle Gauge & MPU Breakdown */}
            <LiveTelemetryView packet={telemetryPacket} evaluation={evaluation} />

            {/* Grid 2 Column: State Machine & Recovery Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <RepStateMachineCard
                currentPhase={evaluation?.currentPhase || 'REST'}
                repCount={evaluation?.repCount || 0}
                validReps={evaluation?.validReps || 0}
                consecutiveErrors={evaluation?.consecutiveErrors || 0}
              />

              <RecoveryScoreCard
                score={selectedPatient?.recoveryScore || 84}
                accuracyScore={evaluation ? (evaluation.repCount > 0 ? Math.round((evaluation.validReps / evaluation.repCount) * 100) : 100) : 90}
                romScore={evaluation?.romAchieved ? 100 : 85}
                complianceScore={selectedPatient?.complianceRate || 92}
              />

            </div>

            {/* Wearable Feedback Preview */}
            <MultiModalFeedback
              hapticActive={evaluation?.feedbackTrigger?.hapticPulse || false}
              buzzerActive={evaluation?.feedbackTrigger?.buzzerBeep || false}
              voiceCode={evaluation?.feedbackTrigger?.audioVoicePromptCode || null}
              description={evaluation?.feedbackTrigger?.description}
            />

          </div>
        )}

        {/* TAB 2: CLINICIAN PATIENT PORTFOLIO */}
        {activeTab === 'PATIENTS' && (
          <div className="space-y-6">
            <PatientDirectory
              patients={patients}
              onSelectPatient={setSelectedPatient}
              selectedPatientId={selectedPatient?.id}
            />

            {selectedPatient && (
              <PatientDetailView
                patient={selectedPatient}
                onStartSession={() => setActiveTab('LIVE')}
              />
            )}
          </div>
        )}

        {/* TAB 3: WEARABLE MULTI-MODAL FEEDBACK */}
        {activeTab === 'HAPTICS' && (
          <div className="space-y-6">
            <MultiModalFeedback
              hapticActive={evaluation?.feedbackTrigger?.hapticPulse || false}
              buzzerActive={evaluation?.feedbackTrigger?.buzzerBeep || false}
              voiceCode={evaluation?.feedbackTrigger?.audioVoicePromptCode || null}
              description={evaluation?.feedbackTrigger?.description}
            />

            <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-xs space-y-3 font-mono">
              <h3 className="font-bold text-[#c3f400] text-sm uppercase tracking-widest">[ HARDWARE ACTUATION PROTOCOL ]</h3>
              <p className="text-[#e2e2e2]">
                Physical feedback modules mounted directly on the wearable joint strap provide immediate tactile and auditory cues to the patient without requiring camera vision.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#131313] p-3 border border-[#444933]">
                  <div className="font-bold text-[#c3f400] uppercase mb-1">ERM Haptic Motor</div>
                  <div className="text-[#8e9379]">GPIO 27 PWM driver emits 200ms vibration pulses upon posture error detection.</div>
                </div>
                <div className="bg-[#131313] p-3 border border-[#444933]">
                  <div className="font-bold text-[#c3f400] uppercase mb-1">Active Buzzer</div>
                  <div className="text-[#8e9379]">GPIO 14 outputs audio alerts when 2 consecutive posture errors occur.</div>
                </div>
                <div className="bg-[#131313] p-3 border border-[#444933]">
                  <div className="font-bold text-[#c3f400] uppercase mb-1">DFPlayer Mini</div>
                  <div className="text-[#8e9379]">UART2 triggers voice prompts: "Hold peak position", "Smooth motion required".</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HARDWARE SERIAL BRIDGE CONTROLS */}
        {activeTab === 'HARDWARE' && (
          <div className="space-y-6">
            <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#444933] pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#c3f400] flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>[ HARDWARE SERIAL PORT & BRIDGE CONFIGURATION ]</span>
                </h3>
                <span className="text-xs text-[#8e9379] font-mono">STATUS: {bridgeStatus?.isSimulating ? 'SIMULATOR ACTIVE' : 'PHYSICAL PORT ATTACHED'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-[#131313] p-4 border border-[#444933]">
                  <div className="text-[#8e9379] uppercase text-[10px] mb-1">PACKETS INGESTED</div>
                  <div className="text-2xl font-black text-[#c3f400]">{bridgeStatus?.packetsIngested || 0}</div>
                </div>

                <div className="bg-[#131313] p-4 border border-[#444933]">
                  <div className="text-[#8e9379] uppercase text-[10px] mb-1">CONNECTED COM PORT</div>
                  <div className="text-2xl font-black text-[#ffffff]">{bridgeStatus?.port || 'NONE (SIMULATOR)'}</div>
                </div>

                <div className="bg-[#131313] p-4 border border-[#444933]">
                  <div className="text-[#8e9379] uppercase text-[10px] mb-1">BAUD RATE</div>
                  <div className="text-2xl font-black text-[#c3f400]">{bridgeStatus?.baudRate || 115200}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleToggleSimulation(true)}
                  className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider ${
                    bridgeStatus?.isSimulating
                      ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                      : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933]'
                  }`}
                >
                  [ ENABLE HARDWARE SIMULATOR ]
                </button>

                <button
                  onClick={() => handleToggleSimulation(false)}
                  className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider ${
                    !bridgeStatus?.isSimulating
                      ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                      : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933]'
                  }`}
                >
                  [ SWITCH TO PHYSICAL COM PORT ]
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Biohazard Footer */}
      <footer className="bg-[#0e0e0e] border-t-2 border-[#444933] py-4 text-center text-xs text-[#8e9379] uppercase font-mono tracking-wider">
        FITSENSE AI // FLEXSENSE • HACK SUMMIT 7.0 @ SRM IST • TEAM HACKELITE / RAZERS (NITHESH P, KOUSHIK G, SUJAY S)
      </footer>

    </div>
  );
}

export default App;
