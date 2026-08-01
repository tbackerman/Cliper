import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { SocialAccount } from '../types';

interface SocialConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: SocialAccount[];
  onUpdateAccountStatus: (accountId: string, connected: boolean) => void;
}

export const SocialConnectModal: React.FC<SocialConnectModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onUpdateAccountStatus,
}) => {
  if (!isOpen) return null;

  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleSimulateConnect = (acc: SocialAccount) => {
    setConnectingId(acc.id);
    setTimeout(() => {
      onUpdateAccountStatus(acc.id, true);
      setConnectingId(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Integrasi Direct API Media Sosial</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Semua unggahan klip diproses secara otomatis melalui API resmi dengan token OAuth2 berstandar keamanan tinggi tanpa memerlukan unggah manual.
        </p>

        {/* Account Cards */}
        <div className="space-y-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img src={acc.avatarUrl} alt={acc.displayName} className="w-10 h-10 rounded-full border border-slate-700" />
                <div>
                  <h4 className="text-xs font-bold text-white">{acc.displayName}</h4>
                  <p className="text-[10px] text-slate-400">{acc.handle} • {acc.followersCount.toLocaleString()} pengikut</p>
                </div>
              </div>

              <div>
                {acc.connected ? (
                  <button
                    onClick={() => onUpdateAccountStatus(acc.id, false)}
                    className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-xl flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terhubung</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulateConnect(acc)}
                    disabled={connectingId === acc.id}
                    className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow"
                  >
                    {connectingId === acc.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Hubungkan API</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs"
          >
            Selesai & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
