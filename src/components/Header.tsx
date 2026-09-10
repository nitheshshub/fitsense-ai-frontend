import React, { useState } from 'react';
import { Activity, Radio, AlertTriangle, ShieldCheck, Server, RefreshCw } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl } from '../services/api';
import { wsClient } from '../services/websocket';

interface HeaderProps {
  wsConnected: boolean;
  activePhase?: string;
  consecutiveErrors?: number;
}

export const Header: React.FC<HeaderProps> = ({ wsConnected, activePhase, consecutiveErrors = 0 }) => {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [showUrlModal, setShowUrlModal] = useState(false);

  const handleUrlChange = (newUrl: string) => {
    setCurrentUrl(newUrl);
    setApiBaseUrl(newUrl);
    wsClient.setWsUrl(newUrl);
    setShowUrlModal(false);
  };

  return (
    <header className="bg-[#0e0e0e] border-b-2 border-[#444933] text-[#e2e2e2] px-6 py-4 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Mission Tagline */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#c3f400] text-[#131313] p-2 font-black text-xl tracking-tighter flex items-center justify-center border border-[#c3f400]">
            <Activity className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold uppercase tracking-wider text-[#ffffff]">
                FITSENSE AI <span className="text-[#c3f400]">// FLEXSENSE</span>
              </h1>
              <span className="bg-[#2a2a2a] text-[#c3f400] text-xs font-semibold px-2 py-0.5 border border-[#444933] uppercase tracking-widest">
                [ DEMO V1.0 ]
              </span>
            </div>
            <p className="text-xs text-[#8e9379] tracking-tight uppercase">
              SMART REHABILITATION & JOINT MOTION ANALYTICS PLATFORM • HACK SUMMIT 7.0
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* WebSocket Live Stream Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 border text-xs font-bold uppercase tracking-widest ${
            wsConnected 
              ? 'bg-[#1b1b1b] border-[#c3f400] text-[#c3f400] glow-yellow' 
              : 'bg-[#1b1b1b] border-[#ff5500] text-[#ff5500]'
          }`}>
            <Radio className={`w-4 h-4 ${wsConnected ? 'animate-pulse text-[#c3f400]' : ''}`} />
            <span>{wsConnected ? '[ STREAM: LIVE ]' : '[ STREAM: RECONNECTING ]'}</span>
          </div>

          {/* Phase Badge */}
          {activePhase && (
            <div className="bg-[#1f1f1f] border border-[#444933] text-[#ffffff] px-3 py-1.5 text-xs font-bold tracking-widest uppercase">
              PHASE: <span className="text-[#c3f400]">{activePhase}</span>
            </div>
          )}

          {/* System Alert Status */}
          {consecutiveErrors >= 2 ? (
            <div className="bg-[#ff5500] text-[#131313] px-3 py-1.5 text-xs font-bold tracking-widest uppercase flex items-center space-x-1 animate-bounce border border-[#ff5500]">
              <AlertTriangle className="w-4 h-4 stroke-[3]" />
              <span>[ HAPTIC WARNING ACTIVE ]</span>
            </div>
          ) : (
            <div className="bg-[#1b1b1b] border border-[#444933] text-[#8e9379] px-3 py-1.5 text-xs font-semibold tracking-widest uppercase flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-[#c3f400]" />
              <span>[ NOMINAL ]</span>
            </div>
          )}

          {/* Cloud API Target Selector */}
          <button 
            onClick={() => setShowUrlModal(!showUrlModal)}
            className="bg-[#1b1b1b] hover:bg-[#2a2a2a] text-[#e2e2e2] hover:text-[#c3f400] px-3 py-1.5 border border-[#444933] hover:border-[#c3f400] text-xs font-bold tracking-wider uppercase transition-colors flex items-center space-x-2"
          >
            <Server className="w-4 h-4 text-[#c3f400]" />
            <span className="hidden sm:inline">RENDER BACKEND</span>
          </button>
        </div>

      </div>

      {/* Target URL Modal */}
      {showUrlModal && (
        <div className="mt-3 max-w-[1440px] mx-auto p-4 bg-[#1b1b1b] border-2 border-[#c3f400] text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-[#c3f400] tracking-wider uppercase">
            <span>[ CONFIGURE BACKEND API TARGET ]</span>
            <button onClick={() => setShowUrlModal(false)} className="text-[#e2e2e2] hover:text-[#ff5500]">✕</button>
          </div>
          <p className="text-[#8e9379]">Select or enter target Express backend endpoint URL:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => handleUrlChange('https://fitsense-ai-backend-vpak.onrender.com')}
              className={`px-3 py-2 border text-left font-mono text-xs ${currentUrl.includes('onrender') ? 'bg-[#c3f400] text-[#131313] font-bold border-[#c3f400]' : 'bg-[#2a2a2a] border-[#444933] text-[#e2e2e2]'}`}
            >
              [ CLOUD RENDER ]: https://fitsense-ai-backend-vpak.onrender.com
            </button>
            <button 
              onClick={() => handleUrlChange('http://localhost:5000')}
              className={`px-3 py-2 border text-left font-mono text-xs ${currentUrl.includes('localhost') ? 'bg-[#c3f400] text-[#131313] font-bold border-[#c3f400]' : 'bg-[#2a2a2a] border-[#444933] text-[#e2e2e2]'}`}
            >
              [ LOCALHOST ]: http://localhost:5000
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
