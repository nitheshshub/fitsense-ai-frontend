import React from 'react';
import { Patient } from '../types';
import { UserCheck, Calendar, Activity, ClipboardList, Target, Award, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PatientDetailViewProps {
  patient: Patient;
  onBack?: () => void;
  onStartSession?: (patientId: string) => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  onBack,
  onStartSession
}) => {
  // Generate historical demo ROM session data for charts
  const sessionData = [
    { session: 'S1', rom: patient.targetRomMin - 15, accuracy: 70 },
    { session: 'S2', rom: patient.targetRomMin - 10, accuracy: 75 },
    { session: 'S3', rom: patient.targetRomMin - 5, accuracy: 82 },
    { session: 'S4', rom: patient.targetRomMin + 2, accuracy: 88 },
    { session: 'S5', rom: patient.targetRomMin + 8, accuracy: 92 },
    { session: 'S6', rom: patient.targetRomMin + 12, accuracy: 95 },
  ];

  return (
    <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-[#e2e2e2] space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#444933] pb-4">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-[#1b1b1b] hover:bg-[#2a2a2a] text-[#e2e2e2] p-2 border border-[#444933]"
            >
              <ArrowLeft className="w-5 h-5 text-[#c3f400]" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-black uppercase text-[#ffffff]">
              {patient.name} <span className="text-[#c3f400]">[{patient.id}]</span>
            </h2>
            <p className="text-xs text-[#8e9379] uppercase font-mono">
              {patient.age}Y • {patient.gender} • {patient.injury}
            </p>
          </div>
        </div>

        {/* Start Session Trigger */}
        {onStartSession && (
          <button
            onClick={() => onStartSession(patient.id)}
            className="bg-[#c3f400] hover:bg-[#abd600] text-[#131313] px-4 py-2 border-2 border-[#c3f400] text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 glow-yellow"
          >
            <Activity className="w-4 h-4" />
            <span>[ INITIATE TRACKING SESSION ]</span>
          </button>
        )}
      </div>

      {/* Patient Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#131313] p-4 border border-[#444933]">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest mb-1 flex items-center space-x-1">
            <Target className="w-3.5 h-3.5 text-[#c3f400]" />
            <span>TARGET ROM WINDOW</span>
          </div>
          <div className="text-2xl font-black text-[#c3f400] font-mono">{patient.targetRomMin}° - {patient.targetRomMax}°</div>
        </div>

        <div className="bg-[#131313] p-4 border border-[#444933]">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest mb-1 flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-[#c3f400]" />
            <span>DEMO RECOVERY SCORE</span>
          </div>
          <div className="text-2xl font-black text-[#ffffff] font-mono">{patient.recoveryScore} / 100</div>
        </div>

        <div className="bg-[#131313] p-4 border border-[#444933]">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest mb-1 flex items-center space-x-1">
            <UserCheck className="w-3.5 h-3.5 text-[#c3f400]" />
            <span>COMPLIANCE RATE</span>
          </div>
          <div className="text-2xl font-black text-[#c3f400] font-mono">{patient.complianceRate}%</div>
        </div>

        <div className="bg-[#131313] p-4 border border-[#444933]">
          <div className="text-[10px] text-[#8e9379] uppercase font-bold tracking-widest mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[#c3f400]" />
            <span>LAST LOGGED SESSION</span>
          </div>
          <div className="text-sm font-bold text-[#ffffff] font-mono mt-1">{patient.lastSessionDate}</div>
        </div>
      </div>

      {/* Historical ROM Progress Graph */}
      <div className="bg-[#131313] p-6 border border-[#444933]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[#c3f400] uppercase tracking-widest">
            [ HISTORICAL FLEXION ROM PROGRESSION (SESSIONS 1 - 6) ]
          </h3>
          <span className="text-[10px] text-[#8e9379] font-mono uppercase">PHYSICAL SENSOR PRECISION</span>
        </div>

        <div className="h-48 w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sessionData}>
              <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
              <XAxis dataKey="session" stroke="#8e9379" />
              <YAxis stroke="#8e9379" domain={[60, 140]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#c3f400', color: '#c3f400' }}
              />
              <Line 
                type="stepAfter" 
                dataKey="rom" 
                stroke="#c3f400" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#c3f400' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Physician Clinical Notes */}
      <div className="bg-[#1b1b1b] p-4 border border-[#444933]">
        <div className="text-xs text-[#c3f400] font-bold uppercase tracking-widest mb-1 flex items-center space-x-2">
          <ClipboardList className="w-4 h-4" />
          <span>[ ATTENDING PHYSICIAN NOTES • {patient.physicianName} ]</span>
        </div>
        <p className="text-xs text-[#e2e2e2] font-mono leading-relaxed">{patient.notes}</p>
      </div>

    </div>
  );
};
