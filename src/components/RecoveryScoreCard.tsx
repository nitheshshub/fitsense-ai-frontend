import React from 'react';
import { Award, Percent, Target, ShieldCheck } from 'lucide-react';

interface RecoveryScoreCardProps {
  score?: number;
  accuracyScore?: number;
  romScore?: number;
  complianceScore?: number;
}

export const RecoveryScoreCard: React.FC<RecoveryScoreCardProps> = ({
  score = 84,
  accuracyScore = 90,
  romScore = 85,
  complianceScore = 75
}) => {
  return (
    <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-[#e2e2e2] space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#444933] pb-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#c3f400] flex items-center space-x-2">
          <Award className="w-4 h-4" />
          <span>[ DEMO RECOVERY SCORE CALCULATION ENGINE ]</span>
        </h3>
        <span className="text-xs bg-[#2a2a2a] text-[#c3f400] px-2 py-0.5 border border-[#444933] uppercase font-mono">
          WEIGHTED METRIC V1.0
        </span>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Overall Composite Score */}
        <div className="bg-[#131313] p-6 border-2 border-[#c3f400] text-center flex flex-col items-center justify-center glow-yellow">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest mb-1">
            COMPOSITE RECOVERY SCORE
          </div>
          <div className="text-6xl font-black font-mono text-[#c3f400]">
            {score}<span className="text-2xl text-[#ffffff]">/100</span>
          </div>
          <div className="mt-2 text-xs text-[#ffffff] font-mono uppercase bg-[#2a2a2a] px-3 py-1 border border-[#444933]">
            STATUS: HIGH RECOVERY PROGRESS
          </div>
        </div>

        {/* 3 Metric Sub-score Weight Breakdown */}
        <div className="md:col-span-2 space-y-3">
          
          {/* 1. Movement Accuracy (40% Weight) */}
          <div className="bg-[#131313] p-3 border border-[#444933]">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#ffffff] font-bold">[ MOVEMENT ACCURACY (40% WEIGHT) ]</span>
              <span className="text-[#c3f400] font-bold">{accuracyScore}%</span>
            </div>
            <div className="w-full bg-[#1b1b1b] h-3 border border-[#444933]">
              <div className="bg-[#c3f400] h-full" style={{ width: `${accuracyScore}%` }} />
            </div>
            <div className="text-[10px] text-[#8e9379] mt-1 uppercase">
              Evaluates ratio of clean trajectory reps vs posture error flags
            </div>
          </div>

          {/* 2. ROM Target Achievement (40% Weight) */}
          <div className="bg-[#131313] p-3 border border-[#444933]">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#ffffff] font-bold">[ ROM TARGET ACHIEVEMENT (40% WEIGHT) ]</span>
              <span className="text-[#c3f400] font-bold">{romScore}%</span>
            </div>
            <div className="w-full bg-[#1b1b1b] h-3 border border-[#444933]">
              <div className="bg-[#c3f400] h-full" style={{ width: `${romScore}%` }} />
            </div>
            <div className="text-[10px] text-[#8e9379] mt-1 uppercase">
              Evaluates max flexion angle achieved vs prescribed target ROM window
            </div>
          </div>

          {/* 3. Session Compliance (20% Weight) */}
          <div className="bg-[#131313] p-3 border border-[#444933]">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#ffffff] font-bold">[ SESSION COMPLIANCE (20% WEIGHT) ]</span>
              <span className="text-[#c3f400] font-bold">{complianceScore}%</span>
            </div>
            <div className="w-full bg-[#1b1b1b] h-3 border border-[#444933]">
              <div className="bg-[#c3f400] h-full" style={{ width: `${complianceScore}%` }} />
            </div>
            <div className="text-[10px] text-[#8e9379] mt-1 uppercase">
              Evaluates completed sessions vs assigned rehabilitation schedule
            </div>
          </div>

        </div>

      </div>

      {/* Formula Readout Banner */}
      <div className="bg-[#131313] p-3 border border-[#444933] font-mono text-xs text-[#8e9379] flex items-center justify-between">
        <span>FORMULA: Score = (0.40 × Accuracy) + (0.40 × ROM) + (0.20 × Compliance)</span>
        <span className="text-[#c3f400] font-bold uppercase">[ DEMO METRIC ]</span>
      </div>

    </div>
  );
};
