import React, { useState, useEffect } from 'react';
import { OfficialUser, OfficialRole } from '../types';
import { 
  Shield, 
  UserCheck, 
  KeyRound, 
  Train, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Fingerprint,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export const OFFICIAL_PRESET_USERS: OfficialUser[] = [
  {
    id: 'user-ctpm-01',
    hrmsId: 'IRTS-1998-HQ01',
    name: 'Dr. Rajeshwari Sengupta, IRTS',
    designation: 'Chief Track Planning & Operations Manager (CTPM)',
    role: 'CHIEF_OPERATIONS_MANAGER',
    department: 'Traffic Operations & Planning (Zonal HQ)',
    zone: 'North Central Railway (NCR)',
    division: 'Zonal Headquarters, Prayagraj',
    clearanceLevel: 'LEVEL_1_ZONAL_HQ',
    avatarInitials: 'RS',
    badgeColor: 'bg-[#9333ea] text-white'
  },
  {
    id: 'user-dom-02',
    hrmsId: 'NCR-DOM-9821',
    name: 'Vikram Aditya Sharma',
    designation: 'Chief Controller / Section Controller (DOM)',
    role: 'SECTION_CONTROLLER',
    department: 'Operating Department (Divisional Control Room)',
    zone: 'North Central Railway (NCR)',
    division: 'Prayagraj Division (HDN-1 Control)',
    clearanceLevel: 'LEVEL_2_DIVISION_CONTROL',
    avatarInitials: 'VA',
    badgeColor: 'bg-[#2563eb] text-white'
  },
  {
    id: 'user-sse-pw-03',
    hrmsId: 'PW-NCR-7721',
    name: 'Arun Kumar Meena',
    designation: 'Senior Section Engineer (SSE / P-Way)',
    role: 'SSE_PWAY',
    department: 'Civil Engineering (Track Maintenance)',
    zone: 'North Central Railway (NCR)',
    division: 'Kanpur Central Sub-Division',
    clearanceLevel: 'LEVEL_3_DEPT_ENGINEER',
    avatarInitials: 'AK',
    badgeColor: 'bg-[#C87428] text-white'
  },
  {
    id: 'user-sse-trd-04',
    hrmsId: 'TRD-NCR-4412',
    name: 'Debashis Roy',
    designation: 'Senior Section Engineer (SSE / TRD - OHE)',
    role: 'SSE_TRD',
    department: 'Electrical Traction Distribution (25kV OHE)',
    zone: 'North Central Railway (NCR)',
    division: 'Fatehpur – Sirathu Section',
    clearanceLevel: 'LEVEL_3_DEPT_ENGINEER',
    avatarInitials: 'DR',
    badgeColor: 'bg-[#ea580c] text-white'
  },
  {
    id: 'user-sse-st-05',
    hrmsId: 'ST-NCR-8834',
    name: 'Sneha Mukherjee',
    designation: 'Senior Section Engineer (SSE / S&T)',
    role: 'SSE_ST',
    department: 'Signal & Telecommunication (Electronic Interlocking)',
    zone: 'North Central Railway (NCR)',
    division: 'Tundla – Etawah Section',
    clearanceLevel: 'LEVEL_3_DEPT_ENGINEER',
    avatarInitials: 'SM',
    badgeColor: 'bg-[#0284c7] text-white'
  },
  {
    id: 'user-sm-cnb-06',
    hrmsId: 'SM-CNB-5541',
    name: 'Manoj Tripathi',
    designation: 'Station Master / Yard Operations In-Charge',
    role: 'STATION_MASTER',
    department: 'Station Operating Staff',
    zone: 'North Central Railway (NCR)',
    division: 'Prayagraj Division',
    postingStation: 'Kanpur Central (CNB)',
    clearanceLevel: 'LEVEL_4_STATION_MASTER',
    avatarInitials: 'MT',
    badgeColor: 'bg-[#16a34a] text-white'
  },
  {
    id: 'user-crs-07',
    hrmsId: 'CRS-GOI-0012',
    name: 'Col. R. K. Nair (Retd.)',
    designation: 'Commissioner of Railway Safety (CRS) Auditor',
    role: 'CRS_SAFETY_AUDITOR',
    department: 'Commission of Railway Safety (Safety & Statutory Audit)',
    zone: 'Northern / North Central Circle',
    division: 'Statutory Safety Audit Wing',
    clearanceLevel: 'LEVEL_5_SAFETY_AUDITOR',
    avatarInitials: 'RN',
    badgeColor: 'bg-[#dc2626] text-white'
  }
];

interface AuthLoginPortalProps {
  onLoginSuccess: (user: OfficialUser) => void;
  currentUser: OfficialUser | null;
  onCancel?: () => void;
  isSwitching?: boolean;
}

export const AuthLoginPortal: React.FC<AuthLoginPortalProps> = ({
  onLoginSuccess,
  currentUser,
  onCancel,
  isSwitching = false
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    currentUser?.id || OFFICIAL_PRESET_USERS[0].id
  );
  const [loginMethod, setLoginMethod] = useState<'PRESET' | 'MANUAL'>('PRESET');

  // Manual Form States
  const [manualHrmsId, setManualHrmsId] = useState('NCR-DOM-9821');
  const [manualName, setManualName] = useState('Vikram Aditya Sharma');
  const [manualRole, setManualRole] = useState<OfficialRole>('SECTION_CONTROLLER');
  const [manualZone, setManualZone] = useState('North Central Railway (NCR)');
  const [manualDivision, setManualDivision] = useState('Prayagraj Division');
  const [securityPin, setSecurityPin] = useState('884210');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Verification Animation States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleSendOtp = () => {
    setIsOtpSent(true);
    setOtpCountdown(45);
    setOtpCode('742819'); // Pre-fill mock OTP for smooth evaluation
  };

  const handleAuthenticate = (userToLogin: OfficialUser) => {
    setIsVerifying(true);
    setErrorMessage(null);

    // Step 1: CRIS Server Handshake
    setVerificationStep('Connecting to CRIS Identity Gateway (HRMS-Auth)...');
    
    setTimeout(() => {
      // Step 2: Digital Certificate validation
      setVerificationStep(`Verifying Digital Security Credentials for ${userToLogin.name}...`);
    }, 600);

    setTimeout(() => {
      // Step 3: Zonal Clearance & RBAC check
      setVerificationStep(`Granting Security Token: [${userToLogin.clearanceLevel}]...`);
    }, 1200);

    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(userToLogin);
    }, 1800);
  };

  const handlePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = OFFICIAL_PRESET_USERS.find(u => u.id === selectedPresetId);
    if (preset) {
      handleAuthenticate(preset);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualHrmsId || !manualName || !securityPin) {
      setErrorMessage('Please provide Employee Code, Official Name, and Security PIN.');
      return;
    }

    const manualUser: OfficialUser = {
      id: `usr-custom-${Date.now()}`,
      hrmsId: manualHrmsId.toUpperCase(),
      name: manualName,
      designation: manualRole === 'CHIEF_OPERATIONS_MANAGER' ? 'Chief Operations Manager'
        : manualRole === 'SECTION_CONTROLLER' ? 'Section Controller (DOM)'
        : manualRole === 'SSE_PWAY' ? 'Senior Section Engineer (P-Way)'
        : manualRole === 'SSE_TRD' ? 'Senior Section Engineer (TRD)'
        : manualRole === 'SSE_ST' ? 'Senior Section Engineer (S&T)'
        : manualRole === 'STATION_MASTER' ? 'Station Master' : 'Safety Auditor',
      role: manualRole,
      department: manualRole === 'SSE_PWAY' ? 'Civil Engineering'
        : manualRole === 'SSE_TRD' ? 'Electrical Traction'
        : manualRole === 'SSE_ST' ? 'Signal & Telecom' : 'Operating Department',
      zone: manualZone,
      division: manualDivision,
      clearanceLevel: manualRole === 'CHIEF_OPERATIONS_MANAGER' ? 'LEVEL_1_ZONAL_HQ'
        : manualRole === 'SECTION_CONTROLLER' ? 'LEVEL_2_DIVISION_CONTROL'
        : manualRole === 'CRS_SAFETY_AUDITOR' ? 'LEVEL_5_SAFETY_AUDITOR' : 'LEVEL_3_DEPT_ENGINEER',
      avatarInitials: manualName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'IR',
      badgeColor: 'bg-[#181816] text-white'
    };

    handleAuthenticate(manualUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181816]/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF7F2] border-2 border-[#E6E0D4] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Official Government Header Banner */}
        <div className="bg-[#181816] text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#C87428]/15 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#2C2B27] border border-[#EDE7DC]/20 flex items-center justify-center text-[#C87428] shrink-0 shadow-inner">
                <Train className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C87428]/20 text-[#C87428] border border-[#C87428]/40 uppercase tracking-widest font-mono">
                    Government of India • Ministry of Railways
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  CRIS RailAI Security & Identity Verification Portal
                </h2>
                <p className="text-[11px] text-[#A8A29E] mt-0.5">
                  Authorized Railway Personnel Access Only • Digital Security Clearance Gateway
                </p>
              </div>
            </div>

            {isSwitching && onCancel && (
              <button
                onClick={onCancel}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer text-xs"
                title="Cancel and continue with current session"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5">
          
          {/* Security Notice */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E6E0D4] flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-[#EBF5EE] text-[#2D7A4D] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#181816] block">Role-Based Access Verification (RBAC)</span>
              <span className="text-[#636059] text-[11px]">
                Please authenticate your Indian Railways official identity. You may select a verified official preset or enter your HRMS ID.
              </span>
            </div>
          </div>

          {/* Mode Tabs (Preset vs Manual) */}
          <div className="flex items-center p-1 rounded-2xl bg-[#EDE7DC]/60 border border-[#E6E0D4]">
            <button
              type="button"
              onClick={() => setLoginMethod('PRESET')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMethod === 'PRESET'
                  ? 'bg-white text-[#181816] shadow-xs'
                  : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C87428]" />
              <span>Select Official Role Preset (Quick Test)</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('MANUAL')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMethod === 'MANUAL'
                  ? 'bg-white text-[#181816] shadow-xs'
                  : 'text-[#636059] hover:text-[#181816]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Custom Official HRMS Login</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-[#FDF2F2] border border-[#F8D7DA] text-[#DC2626] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PRESET ROLE SELECTOR */}
          {loginMethod === 'PRESET' && (
            <form onSubmit={handlePresetSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <label className="font-bold text-xs text-[#181816] flex items-center justify-between">
                  <span>Authorized Railway Official Profiles</span>
                  <span className="text-[10.5px] font-normal text-[#8F8A80]">Click to select role</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {OFFICIAL_PRESET_USERS.map((user) => {
                    const isSelected = selectedPresetId === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedPresetId(user.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                          isSelected
                            ? 'bg-white border-[#181816] ring-2 ring-[#181816] shadow-sm'
                            : 'bg-white/60 border-[#E6E0D4] hover:bg-white hover:border-[#181816]/40'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${user.badgeColor}`}>
                          {user.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-[#181816] text-xs truncate">
                              {user.name}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] font-bold font-mono bg-[#2D7A4D] text-white px-1.5 py-0.2 rounded-full shrink-0">
                                ✓ Chosen
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[#C87428] font-semibold block truncate">
                            {user.designation}
                          </span>
                          <div className="flex items-center gap-1.5 text-[9.5px] text-[#8F8A80] font-mono mt-0.5">
                            <span>ID: {user.hrmsId}</span>
                            <span>•</span>
                            <span className="truncate">{user.zone.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security Verification & Submit */}
              <div className="pt-2 border-t border-[#EDE7DC] flex flex-col gap-3">
                {isVerifying ? (
                  <div className="p-4 rounded-2xl bg-[#181816] text-white flex items-center justify-center gap-3">
                    <RefreshCw className="w-4 h-4 text-[#C87428] animate-spin" />
                    <span className="text-xs font-mono">{verificationStep}</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold text-xs transition active:scale-98 shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="w-4 h-4 text-[#C87428]" />
                    <span>Verify Identity & Enter RailAI Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C87428]" />
                  </button>
                )}
              </div>
            </form>
          )}

          {/* MANUAL CREDENTIALS FORM */}
          {loginMethod === 'MANUAL' && (
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Official Full Name *</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="e.g. Vikram Aditya Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-white text-xs focus:outline-none focus:border-[#181816]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">HRMS / CRIS Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={manualHrmsId}
                    onChange={e => setManualHrmsId(e.target.value)}
                    placeholder="e.g. NCR-DOM-9821"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-white font-mono text-xs focus:outline-none focus:border-[#181816]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Assigned Role / Designation</label>
                  <select
                    value={manualRole}
                    onChange={e => setManualRole(e.target.value as OfficialRole)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-white text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="CHIEF_OPERATIONS_MANAGER">Chief Operations Manager (CTPM / COM)</option>
                    <option value="SECTION_CONTROLLER">Chief / Section Controller (DOM / Sr.DOM)</option>
                    <option value="SSE_PWAY">SSE / P-Way (Track Maintenance)</option>
                    <option value="SSE_TRD">SSE / TRD (25kV OHE Electrical)</option>
                    <option value="SSE_ST">SSE / S&T (Signalling & Telecom)</option>
                    <option value="STATION_MASTER">Station Master / Yard In-Charge</option>
                    <option value="CRS_SAFETY_AUDITOR">Commissioner of Railway Safety (CRS)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#181816] block mb-1">Railway Zone</label>
                  <select
                    value={manualZone}
                    onChange={e => setManualZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-white text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="North Central Railway (NCR)">North Central Railway (NCR)</option>
                    <option value="Eastern Railway (ER)">Eastern Railway (ER)</option>
                    <option value="Western Railway (WR)">Western Railway (WR)</option>
                    <option value="Northern Railway (NR)">Northern Railway (NR)</option>
                    <option value="Southern Railway (SR)">Southern Railway (SR)</option>
                  </select>
                </div>
              </div>

              {/* Security PIN & 2FA OTP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#181816] block mb-1">Security PIN / Access Key *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={securityPin}
                      onChange={e => setSecurityPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-white font-mono text-xs focus:outline-none focus:border-[#181816]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8A80] hover:text-[#181816] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#181816]">2-Factor Rail-OTP</label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpCountdown > 0}
                      className="text-[10px] text-[#2563eb] font-bold hover:underline cursor-pointer disabled:text-[#8F8A80]"
                    >
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Send 2FA OTP'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E0D4] bg-white font-mono text-xs focus:outline-none focus:border-[#181816]"
                  />
                </div>
              </div>

              {/* Security Verification & Submit */}
              <div className="pt-2 border-t border-[#EDE7DC] flex flex-col gap-3 mt-1">
                {isVerifying ? (
                  <div className="p-4 rounded-2xl bg-[#181816] text-white flex items-center justify-center gap-3">
                    <RefreshCw className="w-4 h-4 text-[#C87428] animate-spin" />
                    <span className="text-xs font-mono">{verificationStep}</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#181816] hover:bg-[#2C2B27] text-white font-bold text-xs transition active:scale-98 shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-[#C87428]" />
                    <span>Validate CRIS Credentials & Log In</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C87428]" />
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Legal / Statutory Compliance Disclaimer */}
          <div className="pt-2 text-center text-[10px] text-[#8F8A80] border-t border-[#EDE7DC]">
            <span>Official Railway Information System • Protected under Indian Railways Act 1989 & IT Act 2000</span>
          </div>

        </div>
      </div>
    </div>
  );
};