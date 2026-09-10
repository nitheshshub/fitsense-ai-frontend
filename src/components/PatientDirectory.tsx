import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types';
import { Users, Search, ChevronRight, Activity, AlertOctagon } from 'lucide-react';

interface PatientDirectoryProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatientId?: string;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  patients,
  onSelectPatient,
  selectedPatientId
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const statusCategories = [
    'ALL',
    'Improving',
    'Stable',
    'Needs Attention',
    'Recently Inactive',
    'High Performing'
  ];

  const filteredPatients = patients.filter((p) => {
    const matchesStatus = selectedStatus === 'ALL' || p.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.injury.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Improving':
        return 'bg-[#1b1b1b] border-[#c3f400] text-[#c3f400]';
      case 'Stable':
        return 'bg-[#1b1b1b] border-[#8e9379] text-[#e2e2e2]';
      case 'Needs Attention':
        return 'bg-[#ff5500] border-[#ff5500] text-[#131313] font-black';
      case 'Recently Inactive':
        return 'bg-[#2a2a2a] border-[#ff5500] text-[#ff5500]';
      case 'High Performing':
        return 'bg-[#c3f400] text-[#131313] font-bold border-[#c3f400]';
      default:
        return 'bg-[#1b1b1b] border-[#8e9379] text-[#e2e2e2]';
    }
  };

  return (
    <div className="bg-[#1f1f1f] border-2 border-[#444933] p-6 text-[#e2e2e2]">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#444933] pb-4 mb-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#c3f400] flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>[ CLINICIAN PATIENT RECOVERY DIRECTORY ]</span>
          </h2>
          <p className="text-xs text-[#8e9379] uppercase tracking-tight mt-1">
            REMOTE JOINT MOTION REHABILITATION PORTFOLIO • 5 CLINICAL STATUS CATEGORIES
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#8e9379]" />
          <input
            type="text"
            placeholder="SEARCH PATIENT OR INJURY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131313] border border-[#444933] focus:border-[#c3f400] text-xs px-9 py-2.5 text-[#e2e2e2] uppercase placeholder-[#8e9379] outline-none"
          />
        </div>
      </div>

      {/* Industrial Status Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusCategories.map((status) => {
          const isActive = selectedStatus === status;
          const count = status === 'ALL' ? patients.length : patients.filter(p => p.status === status).length;
          
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 border text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] glow-yellow'
                  : 'bg-[#1b1b1b] text-[#e2e2e2] border-[#444933] hover:border-[#c3f400]'
              }`}
            >
              [ {status} ({count}) ]
            </button>
          );
        })}
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto border border-[#444933] bg-[#131313]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1b1b1b] border-b border-[#444933] text-[11px] font-bold text-[#8e9379] uppercase tracking-widest">
              <th className="p-3">ID</th>
              <th className="p-3">PATIENT NAME</th>
              <th className="p-3">INJURY DIAGNOSIS</th>
              <th className="p-3">STATUS CATEGORY</th>
              <th className="p-3">TARGET ROM</th>
              <th className="p-3">COMPLIANCE</th>
              <th className="p-3">DEMO RECOVERY SCORE</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#444933] text-xs font-mono">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const isSelected = selectedPatientId === patient.id;
                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#2a2a2a] text-[#c3f400]'
                        : 'hover:bg-[#1b1b1b] hover:text-[#c3f400]'
                    }`}
                  >
                    <td className="p-3 font-bold text-[#8e9379]">{patient.id}</td>
                    <td className="p-3 font-bold text-[#ffffff]">{patient.name} ({patient.age}y)</td>
                    <td className="p-3 text-[#e2e2e2]">{patient.injury}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 border text-[10px] uppercase font-bold tracking-wider ${getStatusBadge(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#c3f400] font-bold">{patient.targetRomMin}° - {patient.targetRomMax}°</td>
                    <td className="p-3">{patient.complianceRate}%</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-[#c3f400]">{patient.recoveryScore}</span>
                        <div className="w-16 bg-[#1b1b1b] h-2 border border-[#444933]">
                          <div className="bg-[#c3f400] h-full" style={{ width: `${patient.recoveryScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button className="bg-[#1b1b1b] hover:bg-[#c3f400] text-[#e2e2e2] hover:text-[#131313] p-1.5 border border-[#444933] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-[#8e9379] uppercase">
                  NO PATIENTS FOUND MATCHING SELECTED STATUS CATEGORY.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
