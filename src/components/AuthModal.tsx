import React, { useState } from 'react';
import { UserCheck, Shield, Key, Stethoscope, User, ArrowRight, Lock, CheckCircle2, AlertCircle, Building2, Sparkles } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: 'CLINICIAN' | 'PATIENT';
  clinicId?: string;
  licenseNumber?: string;
  patientId?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<'CLINICIAN' | 'PATIENT'>('CLINICIAN');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [clinicCode, setClinicCode] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (presetRole: 'CLINICIAN' | 'PATIENT') => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      let profile: UserProfile;
      if (presetRole === 'CLINICIAN') {
        profile = {
          name: 'Dr. Nithesh P',
          email: 'dr.nithesh@fitsense.ai',
          role: 'CLINICIAN',
          clinicId: 'SRM-ORTHO-01',
          licenseNumber: 'TN-MC-88492'
        };
      } else {
        profile = {
          name: 'Rajesh Kumar',
          email: 'rajesh.k@patient.fitsense.ai',
          role: 'PATIENT',
          patientId: 'PAT-8849'
        };
      }
      setIsLoading(false);
      setSuccessMsg(`AUTHENTICATION SUCCESSFUL. WELCOME BACK, ${profile.name.toUpperCase()}!`);
      setTimeout(() => {
        onLoginSuccess(profile);
        onClose();
      }, 700);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('PLEASE PROVIDE BOTH EMAIL/ID AND PASSCODE.');
      return;
    }

    if (mode === 'REGISTER' && !fullName) {
      setError('FULL NAME IS REQUIRED FOR ACCOUNT CREATION.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const profile: UserProfile = {
        name: fullName || (email.split('@')[0].toUpperCase()),
        email: email,
        role: role,
        clinicId: clinicCode || 'SRM-MAIN-CLINIC',
        licenseNumber: licenseNumber || 'TN-MED-10293',
        patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setIsLoading(false);
      setSuccessMsg(mode === 'LOGIN' ? 'AUTHENTICATION GRANTED.' : 'CLINICAL ACCOUNT CREATED & REGISTERED.');
      setTimeout(() => {
        onLoginSuccess(profile);
        onClose();
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191919] border-2 border-[#c3f400] max-w-lg w-full p-6 text-[#e2e2e2] shadow-[0_0_50px_rgba(195,244,0,0.15)] relative font-sans">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b-2 border-[#444933] pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <div className="bg-[#c3f400] text-[#131313] p-1.5 font-bold">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#c3f400]">
                [ CLINICAL AUTHENTICATION PORTAL ]
              </h2>
              <p className="text-[10px] font-mono text-[#8e9379] uppercase">
                SECURE BIOMETRIC & TELEMETRY DASHBOARD ACCESS
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8e9379] hover:text-[#ff5500] text-xs font-mono font-bold px-2 py-1 border border-[#444933] hover:border-[#ff5500] transition-colors"
          >
            [ ESC ✕ ]
          </button>
        </div>

        {/* Current User Status Banner (If Logged In) */}
        {currentUser && (
          <div className="bg-[#131313] border border-[#444933] p-3 mb-5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-[#c3f400]">
              <UserCheck className="w-4 h-4" />
              <span>CURRENTLY LOGGED IN: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
            </div>
            <span className="text-[10px] text-[#8e9379]">[ ACTIVE SESSION ]</span>
          </div>
        )}

        {/* Quick Demo Login Presets */}
        <div className="mb-5 bg-[#131313] border border-[#444933] p-3 space-y-2">
          <div className="text-[10px] font-mono font-bold text-[#8e9379] uppercase flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#c3f400]" />
            <span>EXPRESS HACKATHON DEMO AUTHENTICATION:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('CLINICIAN')}
              disabled={isLoading}
              className="bg-[#222718] hover:bg-[#c3f400] text-[#c3f400] hover:text-[#131313] border border-[#c3f400] p-2 text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>⚡ CLINICIAN LOGIN</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('PATIENT')}
              disabled={isLoading}
              className="bg-[#242424] hover:bg-[#ffffff] text-[#ffffff] hover:text-[#131313] border border-[#444933] hover:border-[#ffffff] p-2 text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#c3f400]" />
              <span>⚡ PATIENT LOGIN</span>
            </button>
          </div>
        </div>

        {/* Mode Toggle (SIGN IN vs CREATE ACCOUNT) */}
        <div className="grid grid-cols-2 gap-2 border-b border-[#444933] pb-4 mb-5 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(null); }}
            className={`py-2 px-3 font-bold uppercase border transition-all ${
              mode === 'LOGIN'
                ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] font-black'
                : 'bg-[#131313] text-[#8e9379] border-[#444933] hover:text-[#e2e2e2]'
            }`}
          >
            [ 01 // SIGN IN ]
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setError(null); }}
            className={`py-2 px-3 font-bold uppercase border transition-all ${
              mode === 'REGISTER'
                ? 'bg-[#c3f400] text-[#131313] border-[#c3f400] font-black'
                : 'bg-[#131313] text-[#8e9379] border-[#444933] hover:text-[#e2e2e2]'
            }`}
          >
            [ 02 // CREATE ACCOUNT ]
          </button>
        </div>

        {/* Role Selection Toggle */}
        <div className="mb-5 space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-[#8e9379] uppercase tracking-wider block">
            SELECT ACCESS ROLE / PRIVILEGE LEVEL:
          </label>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setRole('CLINICIAN')}
              className={`p-2.5 border text-left flex items-center space-x-2 transition-all ${
                role === 'CLINICIAN'
                  ? 'bg-[#222718] border-[#c3f400] text-[#c3f400] font-bold'
                  : 'bg-[#131313] border-[#444933] text-[#8e9379]'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <div>
                <div className="leading-none text-xs uppercase font-bold">CLINICIAN</div>
                <div className="text-[9px] text-[#8e9379] mt-0.5">Doctor / Physio</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={`p-2.5 border text-left flex items-center space-x-2 transition-all ${
                role === 'PATIENT'
                  ? 'bg-[#222718] border-[#c3f400] text-[#c3f400] font-bold'
                  : 'bg-[#131313] border-[#444933] text-[#8e9379]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <div>
                <div className="leading-none text-xs uppercase font-bold">PATIENT</div>
                <div className="text-[9px] text-[#8e9379] mt-0.5">Rehab Telemetry</div>
              </div>
            </button>
          </div>
        </div>

        {/* Alerts & Errors */}
        {error && (
          <div className="bg-[#ff5500]/10 border border-[#ff5500] text-[#ff5500] p-3 mb-4 text-xs font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-[#c3f400]/10 border border-[#c3f400] text-[#c3f400] p-3 mb-4 text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'REGISTER' && (
            <div>
              <label className="text-[10px] font-mono font-bold text-[#8e9379] uppercase block mb-1">
                FULL NAME / MEDICAL TITLE:
              </label>
              <input
                type="text"
                placeholder={role === 'CLINICIAN' ? 'e.g. Dr. Nithesh P' : 'e.g. Rajesh Kumar'}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-[#131313] border border-[#444933] focus:border-[#c3f400] text-[#e2e2e2] px-3 py-2 text-xs font-mono outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono font-bold text-[#8e9379] uppercase block mb-1">
              CLINICAL EMAIL OR USER ID:
            </label>
            <input
              type="email"
              placeholder={role === 'CLINICIAN' ? 'dr.nithesh@fitsense.ai' : 'patient8849@fitsense.ai'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#131313] border border-[#444933] focus:border-[#c3f400] text-[#e2e2e2] px-3 py-2 text-xs font-mono outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-[#8e9379] uppercase block mb-1">
              PASSCODE / SECURITY KEY:
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#131313] border border-[#444933] focus:border-[#c3f400] text-[#e2e2e2] px-3 py-2 text-xs font-mono outline-none transition-colors"
            />
          </div>

          {mode === 'REGISTER' && role === 'CLINICIAN' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono font-bold text-[#8e9379] uppercase block mb-1">
                  FACILITY / CLINIC CODE:
                </label>
                <input
                  type="text"
                  placeholder="SRM-ORTHO-01"
                  value={clinicCode}
                  onChange={e => setClinicCode(e.target.value)}
                  className="w-full bg-[#131313] border border-[#444933] focus:border-[#c3f400] text-[#e2e2e2] px-3 py-2 text-xs font-mono outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-[#8e9379] uppercase block mb-1">
                  MEDICAL LICENSE NO:
                </label>
                <input
                  type="text"
                  placeholder="TN-MC-88492"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  className="w-full bg-[#131313] border border-[#444933] focus:border-[#c3f400] text-[#e2e2e2] px-3 py-2 text-xs font-mono outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c3f400] hover:bg-[#d5ff24] text-[#131313] font-bold p-3 text-xs uppercase tracking-widest border border-[#c3f400] glow-yellow transition-all flex items-center justify-center space-x-2 mt-4"
          >
            {isLoading ? (
              <span className="font-mono text-xs uppercase">[ AUTHENTICATING ENCRYPTED TELEMETRY KEY... ]</span>
            ) : (
              <>
                <Key className="w-4 h-4 stroke-[2.5]" />
                <span>{mode === 'LOGIN' ? 'AUTHENTICATE & ACCESS DASHBOARD' : 'REGISTER CLINICAL ACCOUNT'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-[#444933] text-[9px] font-mono text-[#8e9379] flex items-center justify-between">
          <span>ENCRYPTION: 256-BIT AES BIOMETRIC</span>
          <span>SRM IST HACK SUMMIT 7.0</span>
        </div>

      </div>
    </div>
  );
};
