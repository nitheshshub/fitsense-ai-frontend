import React from 'react';
import { EvaluationResult, TelemetryPacket } from '../types';
import { Gauge, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';

interface LiveTelemetryViewProps {
  packet: TelemetryPacket | null;
  evaluation: EvaluationResult | null;
  onResetAngle?: () => void;
}

export const LiveTelemetryView: React.FC<LiveTelemetryViewProps> = ({ packet, evaluation, onResetAngle }) => {
  const isSimulated = packet?.isSimulated ?? false;
  const isStandby = !packet || packet.deviceId === 'STANDBY' || (!isSimulated && (packet?.deviceId || '').includes('SIMULATOR'));
  const angle = isStandby ? 0 : packet.flexionAngle;

  const minRom = evaluation?.targetRom.min ?? 90;
  const maxRom = evaluation?.targetRom.max ?? 120;
  const romAchieved = isStandby ? false : (evaluation?.romAchieved ?? false);
  const isValidForm = evaluation?.isValidForm ?? true;
  const postureFlags = evaluation?.postureFlags ?? [];

  // Gauge Percentage Calculation (0° to 140° max range)
  const gaugePercent = Math.min(100, Math.max(0, (angle / 140) * 100));

  return (
    <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-[#e2e2e2] flex flex-col justify-between space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#444933] pb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#c3f400] flex items-center space-x-2">
          <Gauge className="w-4 h-4" />
          <span>[ REAL-TIME DUAL MPU6050 TELEMETRY ]</span>
        </h2>
        <div className="flex items-center space-x-2">
          {onResetAngle && (
            <button
              onClick={onResetAngle}
              className="text-[10px] bg-[#131313] hover:bg-[#c3f400] text-[#c3f400] hover:text-[#131313] px-2 py-0.5 border border-[#c3f400] font-mono font-bold uppercase transition-all flex items-center space-x-1"
              title="Force angle readout to 0.0 DEG baseline"
            >
              <span>🎯 ZERO BASELINE (0.0°)</span>
            </button>
          )}
          <span className={`text-xs px-2.5 py-0.5 border font-bold uppercase tracking-wider ${
            isStandby
              ? 'bg-[#1b1b1b] border-[#444933] text-[#8e9379]'
              : isSimulated
                ? 'bg-[#1b1b1b] border-[#444933] text-[#8e9379]'
                : 'bg-[#c3f400] text-[#131313] border-[#c3f400]'
          }`}>
            {isStandby ? '[ HARDWARE: STANDBY ]' : isSimulated ? '[ HARDWARE: SIMULATOR ]' : '[ HARDWARE: PHYSICAL ESP32 COM ]'}
          </span>
        </div>
      </div>

      {/* Main Flexion Angle Digital Meter & Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Giant Angle Readout */}
        <div className="bg-[#131313] p-6 border-2 border-[#444933] flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-widest text-[#8e9379] font-bold mb-1">
            RELATIVE JOINT FLEXION ANGLE
          </div>
          <div className="text-7xl font-black font-mono tracking-tighter text-[#c3f400]">
            {angle.toFixed(1)}<span className="text-3xl text-[#ffffff] ml-1">DEG°</span>
          </div>
          <div className="mt-3 w-full bg-[#1b1b1b] h-4 border border-[#444933] overflow-hidden p-0.5">
            <div 
              className={`h-full transition-all duration-100 ${
                romAchieved ? 'bg-[#c3f400] glow-yellow' : 'bg-[#abd600]'
              }`} 
              style={{ width: `${gaugePercent}%` }}
            />
          </div>
          <div className="w-full flex justify-between text-[10px] font-mono text-[#8e9379] mt-1">
            <span>0° REST</span>
            <span className="text-[#c3f400] font-bold">TARGET: {minRom}° - {maxRom}°</span>
            <span>140° MAX</span>
          </div>
        </div>

        {/* MPU6050 Dual Sensor Breakdown & Target Status */}
        <div className="space-y-4">
          
          {/* Target ROM Window Card */}
          <div className="bg-[#1b1b1b] p-4 border border-[#444933]">
            <div className="text-xs text-[#8e9379] uppercase font-bold tracking-widest mb-2 flex items-center justify-between">
              <span>[ REHAB TARGET ROM WINDOW ]</span>
              <span className={romAchieved ? 'text-[#c3f400] font-bold' : 'text-[#8e9379]'}>
                {romAchieved ? '✓ TARGET ACHIEVED' : 'IN PROGRESS'}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-[#ffffff]">TARGET MIN: <strong className="text-[#c3f400]">{minRom}°</strong></span>
              <span className="text-[#ffffff]">TARGET MAX: <strong className="text-[#c3f400]">{maxRom}°</strong></span>
            </div>
          </div>

          {/* Dual Sensor Orientations */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-[#1b1b1b] p-3 border border-[#444933]">
              <div className="text-[#8e9379] uppercase font-bold text-[10px] mb-1 flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-[#c3f400]" />
                <span>THIGH IMU (0x68)</span>
              </div>
              <div className="text-[#ffffff]">PITCH: <span className="text-[#c3f400] font-bold">{packet?.sensor1?.pitch ?? 0}°</span></div>
              <div className="text-[#8e9379]">ROLL: {packet?.sensor1?.roll ?? 0}°</div>
            </div>

            <div className="bg-[#1b1b1b] p-3 border border-[#444933]">
              <div className="text-[#8e9379] uppercase font-bold text-[10px] mb-1 flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-[#c3f400]" />
                <span>SHIN IMU (0x69)</span>
              </div>
              <div className="text-[#ffffff]">PITCH: <span className="text-[#c3f400] font-bold">{packet?.sensor2?.pitch ?? 0}°</span></div>
              <div className="text-[#8e9379]">ROLL: {packet?.sensor2?.roll ?? 0}°</div>
            </div>
          </div>

        </div>

      </div>

      {/* Posture Form Evaluation Flags Banner */}
      <div className="bg-[#131313] p-4 border border-[#444933] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {isValidForm ? (
            <CheckCircle className="w-5 h-5 text-[#c3f400]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-[#ff5500] stroke-[3]" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider">
            FORM STATUS: {isValidForm ? <span className="text-[#c3f400]">[ NOMINAL FORM ]</span> : <span className="text-[#ff5500]">[ POSTURE ERROR ]</span>}
          </span>
        </div>

        {/* Flag Badges */}
        <div className="flex flex-wrap gap-2">
          {postureFlags.length > 0 ? (
            postureFlags.map((flag, idx) => (
              <span key={idx} className="bg-[#ff5500] text-[#131313] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                ⚠️ {flag}
              </span>
            ))
          ) : (
            <span className="bg-[#1b1b1b] text-[#c3f400] border border-[#c3f400] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              [ CLEAN VELOCITY TRAJECTORY ]
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
