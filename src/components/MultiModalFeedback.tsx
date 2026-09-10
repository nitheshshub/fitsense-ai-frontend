import React from 'react';
import { Volume2, Zap, AlertTriangle, Radio } from 'lucide-react';

interface MultiModalFeedbackProps {
  hapticActive: boolean;
  buzzerActive: boolean;
  voiceCode: number | null;
  description?: string;
}

export const MultiModalFeedback: React.FC<MultiModalFeedbackProps> = ({
  hapticActive = false,
  buzzerActive = false,
  voiceCode = null,
  description = 'NOMINAL: Normal form trajectory'
}) => {

  const getVoiceText = (code: number | null) => {
    switch (code) {
      case 1:
        return '"HOLD PEAK POSITION"';
      case 2:
        return '"SMOOTH MOTION REQUIRED"';
      case 3:
        return '"POSTURE FORM CORRECTION NEEDED"';
      case 4:
        return '"CAUTION: HYPEREXTENSION DANGER"';
      default:
        return '[ NO AUDIO PROMPT ACTIVE ]';
    }
  };

  return (
    <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-[#e2e2e2] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#444933] pb-3 mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#c3f400] flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>[ WEARABLE MULTI-MODAL FEEDBACK SIMULATION ]</span>
        </h3>
        <span className="text-xs bg-[#2a2a2a] text-[#8e9379] px-2 py-0.5 border border-[#444933] uppercase">
          HARDWARE ACTUATORS
        </span>
      </div>

      {/* 3 Feedback Module Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        
        {/* 1. Haptic Vibration Motor Driver */}
        <div className={`p-4 border transition-all ${
          hapticActive 
            ? 'bg-[#ff5500] text-[#131313] border-[#ff5500] glow-orange animate-pulse' 
            : 'bg-[#131313] text-[#e2e2e2] border-[#444933]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>HAPTIC VIBRATION</span>
            </span>
            <span className="text-[10px] uppercase font-mono font-bold">GPIO 27</span>
          </div>
          <div className="text-lg font-black font-mono">
            {hapticActive ? '[ PULSING ]' : '[ OFF ]'}
          </div>
          <p className={`text-[10px] mt-1 uppercase ${hapticActive ? 'text-[#131313]' : 'text-[#8e9379]'}`}>
            Targeted ERM Haptic Motor Pulse
          </p>
        </div>

        {/* 2. Buzzer Module */}
        <div className={`p-4 border transition-all ${
          buzzerActive 
            ? 'bg-[#ff5500] text-[#131313] border-[#ff5500] glow-orange' 
            : 'bg-[#131313] text-[#e2e2e2] border-[#444933]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>BUZZER ALARM</span>
            </span>
            <span className="text-[10px] uppercase font-mono font-bold">GPIO 14</span>
          </div>
          <div className="text-lg font-black font-mono">
            {buzzerActive ? '[ ALARM BEEP ]' : '[ SILENT ]'}
          </div>
          <p className={`text-[10px] mt-1 uppercase ${buzzerActive ? 'text-[#131313]' : 'text-[#8e9379]'}`}>
            Active Buzzer Module Trigger
          </p>
        </div>

        {/* 3. DFPlayer Mini Audio Prompts */}
        <div className={`p-4 border transition-all ${
          voiceCode !== null 
            ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow' 
            : 'bg-[#131313] text-[#e2e2e2] border-[#444933]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
              <Volume2 className="w-4 h-4" />
              <span>DFPLAYER VOICE</span>
            </span>
            <span className="text-[10px] uppercase font-mono font-bold">UART2 (Rx/Tx)</span>
          </div>
          <div className="text-xs font-black font-mono truncate">
            {getVoiceText(voiceCode)}
          </div>
          <p className={`text-[10px] mt-1 uppercase ${voiceCode !== null ? 'text-[#131313]' : 'text-[#8e9379]'}`}>
            MP3 Audio Voice Cue Code
          </p>
        </div>

      </div>

      {/* Description Log */}
      <div className="bg-[#131313] p-3 border border-[#444933] text-xs font-mono flex items-center justify-between">
        <span className="text-[#8e9379] uppercase font-bold">[ SYSTEM FEEDBACK STATUS ]:</span>
        <span className={hapticActive || buzzerActive ? 'text-[#ff5500] font-bold' : 'text-[#c3f400]'}>
          {description}
        </span>
      </div>

    </div>
  );
};
