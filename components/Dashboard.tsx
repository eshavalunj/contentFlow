
import React from 'react';
import { Activity, TrendingUp, Users, Clock, ArrowUpRight, Zap, PenTool } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  onStartCampaign?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartCampaign }) => {
  const stats = [
    { label: "Active Campaigns", value: "12", change: "+2 this week", icon: Activity },
    { label: "Scheduled Posts", value: "34", change: "Next: 2h 15m", icon: Clock },
    { label: "Total Engagement", value: "84.2K", change: "+12.5% vs last month", icon: TrendingUp },
  ];

  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 5780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 6490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Quick Start Hero */}
      <div className="bg-slate-900 p-10 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white group">
         <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none group-hover:bg-indigo-600/15 transition-colors"></div>
         <div className="relative z-10 max-w-xl">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
               <Zap size={14} />
               <span>Instant Intelligence</span>
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Generate High-Impact Content in Seconds.</h2>
            <p className="text-slate-400 font-mono text-sm leading-relaxed mb-6">
               Input raw source data or reference links. Our engine synthesizes thematic campaigns across X, LinkedIn, and Instagram automatically.
            </p>
            <button 
              onClick={onStartCampaign}
              className="px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center space-x-3"
            >
               <PenTool size={16} />
               <span>Create New Campaign</span>
            </button>
         </div>
         <div className="hidden md:block relative z-10">
            <div className="w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl absolute -top-10 -right-10"></div>
            <Activity size={120} className="text-slate-800 opacity-50" />
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon size={80} className="text-indigo-600" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
              <p className="text-xs font-mono text-indigo-600 flex items-center">
                 <ArrowUpRight size={12} className="mr-1" />
                 {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Chart */}
        <div className="bg-white p-6 border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Aggregated Engagement</h3>
             <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 p-1.5 outline-none uppercase cursor-pointer">
                <option>LAST 7 DAYS</option>
                <option>LAST 30 DAYS</option>
             </select>
           </div>
           <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontFamily: 'monospace'}} />
                 <YAxis hide />
                 <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none', fontStyle: 'monospace', fontSize: '10px' }} cursor={{stroke: '#4f46e5', strokeWidth: 1}} />
                 <Area type="step" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Deployment Stream</h3>
             <span className="text-[10px] text-slate-400 font-mono">LIVE FEED</span>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
                 <div className="w-10 h-10 bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Zap size={16} className="text-indigo-600" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">Campaign Sync: <span className="text-slate-500 font-medium">Q3 GROWTH PUSH</span></p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">AUTH: SYSTEM_ADMIN • {i * 15}M AGO</p>
                 </div>
                 <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tighter border border-emerald-100">
                    STAGED
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
