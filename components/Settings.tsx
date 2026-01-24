
import React, { useState } from 'react';
import { Twitter, Linkedin, Instagram, Link2, Power, Key, ChevronDown, CheckCircle2 } from 'lucide-react';

const Settings: React.FC = () => {
  const [accounts, setAccounts] = useState({
      twitter: true,
      linkedin: true,
      instagram: false
  });

  const [apiKeys, setApiKeys] = useState({
      'Gemini': 'env_active_xxxxxx',
      'OpenAI': '',
      'Anthropic': '',
      'LinkedIn Graph': 'sk_live_xxxxxxx'
  });

  const [selectedProvider, setSelectedProvider] = useState<string>('Gemini');
  const [tempKey, setTempKey] = useState('');

  const toggleAccount = (key: keyof typeof accounts) => {
      setAccounts(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleUpdateKey = () => {
      if (!tempKey) return;
      setApiKeys(prev => ({ ...prev, [selectedProvider]: tempKey }));
      setTempKey('');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">System Configuration</h2>
        <p className="text-slate-500 font-mono text-xs mt-1">MANAGE INTEGRATIONS & KEYS</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Connected Accounts */}
        <div className="bg-white border border-slate-200 shadow-sm p-8">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center space-x-2">
             <Link2 size={16} className="text-indigo-600" />
             <span>Connected Platforms</span>
           </h3>
           
           <div className="space-y-4">
              {[
                  { key: 'twitter', label: 'X (Twitter)', icon: Twitter },
                  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                  { key: 'instagram', label: 'Instagram', icon: Instagram }
              ].map((platform) => (
                  <div key={platform.key} className="flex items-center justify-between p-4 border border-slate-200 bg-slate-50">
                      <div className="flex items-center space-x-4">
                          <div className={`p-2 bg-white border border-slate-200`}>
                             <platform.icon size={20} className="text-slate-700" />
                          </div>
                          <div>
                              <p className="font-bold text-slate-800 text-sm uppercase">{platform.label}</p>
                              <p className="font-mono text-[10px] text-slate-400">
                                  {accounts[platform.key as keyof typeof accounts] ? 'CONNECTION ACTIVE' : 'DISCONNECTED'}
                              </p>
                          </div>
                      </div>
                      <button 
                        onClick={() => toggleAccount(platform.key as keyof typeof accounts)}
                        className={`w-12 h-6 flex items-center rounded-none p-1 transition-colors duration-300 focus:outline-none border ${accounts[platform.key as keyof typeof accounts] ? 'bg-indigo-600 border-indigo-600 justify-end' : 'bg-slate-200 border-slate-300 justify-start'}`}
                      >
                          <div className={`w-3 h-3 bg-white shadow-sm transform transition-transform`} />
                      </button>
                  </div>
              ))}
           </div>
        </div>

        {/* API Keys with Provider Dropdown */}
        <div className="bg-white border border-slate-200 shadow-sm p-8">
           <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center space-x-2">
             <Key size={16} className="text-indigo-600" />
             <span>API Infrastructure</span>
           </h3>
           
           <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Provider Selector */}
                  <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Provider</label>
                      <div className="relative">
                          <select 
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 px-4 py-3 pr-10 font-bold text-sm text-slate-800 outline-none focus:border-indigo-600 cursor-pointer"
                          >
                              {Object.keys(apiKeys).map(provider => (
                                  <option key={provider} value={provider}>{provider}</option>
                              ))}
                          </select>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                              <ChevronDown size={14} className="text-slate-400" />
                          </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">CONFIGURE THE PRIMARY ENDPOINT FOR THIS SERVICE.</p>
                  </div>

                  {/* Key Display/Edit */}
                  <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key Management</label>
                      <div className="flex space-x-2">
                          <input 
                            type="password" 
                            placeholder={apiKeys[selectedProvider as keyof typeof apiKeys] ? '••••••••••••••••' : 'Enter New Key'}
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 font-mono text-sm text-slate-800 outline-none focus:border-indigo-600" 
                          />
                          <button 
                            onClick={handleUpdateKey}
                            className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-sm"
                          >
                              Update
                          </button>
                      </div>
                      {apiKeys[selectedProvider as keyof typeof apiKeys] && (
                        <div className="flex items-center space-x-1 text-emerald-600">
                          <CheckCircle2 size={10} />
                          <span className="text-[9px] font-bold uppercase">Stored Successfully</span>
                        </div>
                      )}
                  </div>
              </div>

              {/* Status Table */}
              <div className="border border-slate-100 bg-slate-50 p-4">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Service Health Overview</h4>
                  <div className="space-y-2">
                      {Object.entries(apiKeys).map(([name, key]) => (
                          <div key={name} className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-slate-600 uppercase">{name}</span>
                              <div className="flex items-center space-x-2">
                                  <span className={key ? 'text-emerald-500' : 'text-slate-300'}>{key ? 'ACTIVE' : 'NOT CONFIGURED'}</span>
                                  <div className={`w-1.5 h-1.5 rounded-full ${key ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
           </div>
        </div>

         {/* Danger Zone */}
         <div className="border border-red-100 bg-red-50 p-6">
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest mb-2 flex items-center space-x-2">
                 <Power size={16} />
                 <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-red-700 mb-4">Irreversible actions regarding account data.</p>
            <button className="px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 text-xs font-bold uppercase transition-colors">
                Purge All Campaign Data
            </button>
         </div>

      </div>
    </div>
  );
};

export default Settings;
