import React from 'react';
import { ExercisePhase } from '../types';
import { Play, CheckCircle2, RotateCcw, Award } from 'lucide-react';

interface RepStateMachineCardProps {
  currentPhase: ExercisePhase;
  repCount: number;
  validReps: number;
  consecutiveErrors: number;
}

export const RepStateMachineCard: React.FC<RepStateMachineCardProps> = ({
  currentPhase = 'REST',
  repCount = 0,
  validReps = 0,
  consecutiveErrors = 0
}) => {
  const phases: { id: ExercisePhase; label: string; desc: string }[] = [
    { id: 'REST', label: '01 // REST', desc: 'At rest (≤15° flexion)' },
    { id: 'FLEXION', label: '02 // FLEXION', desc: 'Ascending flexion' },
    { id: 'PEAK_HOLD', label: '03 // PEAK HOLD', desc: 'Target ROM window' },
    { id: 'EXTENSION', label: '04 // EXTENSION', desc: 'Returning to rest' },
  ];

  return (
    <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-[#e2e2e2] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#444933] pb-3 mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#c3f400] flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>[ REPETITION STATE MACHINE ]</span>
        </h3>
        <span className="text-xs bg-[#2a2a2a] text-[#8e9379] px-2 py-0.5 border border-[#444933] uppercase">
          AUTOMATED RECONSTRUCTION
        </span>
      </div>

      {/* Phase Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {phases.map((p) => {
          const isActive = currentPhase === p.id;
          return (
            <div
              key={p.id}
              className={`p-3 border transition-all ${
                isActive
                  ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] font-bold glow-yellow'
                  : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933]'
              }`}
            >
              <div className="text-xs tracking-wider uppercase mb-1">{p.label}</div>
              <div className={`text-[10px] uppercase ${isActive ? 'text-[#131313]' : 'text-[#8e9379]'}`}>
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rep Counts Summary Banner */}
      <div className="grid grid-cols-3 gap-3 bg-[#131313] p-4 border border-[#444933]">
        <div className="border-r border-[#444933] pr-3">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest">[ TOTAL REPS ]</div>
          <div className="text-3xl font-black text-[#ffffff] font-mono">{repCount}</div>
        </div>

        <div className="border-r border-[#444933] pr-3 px-2">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest">[ VALID FORM REPS ]</div>
          <div className="text-3xl font-black text-[#c3f400] font-mono">{validReps}</div>
        </div>

        <div className="px-2">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest">[ FORM ACCURACY ]</div>
          <div className="text-3xl font-black text-[#ffffff] font-mono">
            {repCount > 0 ? `${Math.round((validReps / repCount) * 100)}%` : '100%'}
          </div>
        </div>
      </div>

      {/* Consecutive Errors Warning */}
      {consecutiveErrors > 0 && (
        <div className="mt-4 bg-[#2a2a2a] border-l-4 border-[#ff5500] p-3 text-xs flex items-center justify-between text-[#ff5500]">
          <span className="font-bold uppercase tracking-wider">
            ⚠️ CONSECUTIVE POSTURE ERRORS: {consecutiveErrors} / 2
          </span>
          <span className="text-[10px] uppercase text-[#8e9379]">HAPTIC ALERT THRESHOLD</span>
        </div>
      )}

    </div>
  );
};
