
import React, { useState, useMemo } from 'react';
import { Calendar, MoreHorizontal, Filter, X, Check, Trash2, Edit3, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { PostStatus } from '../types';

interface ScheduledPostItem {
    id: number;
    date: string;
    platform: string;
    content: string;
    campaign: string;
    status: PostStatus;
}

const GlobalSchedule: React.FC = () => {
  const [posts, setPosts] = useState<ScheduledPostItem[]>([
    { id: 1, date: "2023-11-24T09:00", platform: "LinkedIn", content: "Excited to announce our new partnership with GlobalTech Solutions. Together we are redefining what's possible in the AI space.", campaign: "Q3 Partnership", status: "SCHEDULED" },
    { id: 2, date: "2023-11-24T10:30", platform: "Twitter", content: "Our CEO just dropped a new thread on AI ethics. A must-read for anyone in building the future of humanity. 🧵👇", campaign: "CEO Thought Leadership", status: "SCHEDULED" },
    { id: 3, date: "2023-11-25T14:00", platform: "Instagram", content: "Behind the scenes at the office today! 📸 The team is working hard on something massive. Stay tuned.", campaign: "Culture Series", status: "PENDING" },
    { id: 4, date: "2023-11-26T09:00", platform: "LinkedIn", content: "New case study: How we scaled to 1M users in under 12 months using purely organic content cycles.", campaign: "Growth Case Study", status: "SCHEDULED" },
    { id: 5, date: "2023-11-26T12:00", platform: "Twitter", content: "Scaling is hard. Here are 5 lessons learned from our growth sprint that you can apply today.", campaign: "Growth Case Study", status: "PENDING" },
  ]);

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<PostStatus | 'ALL'>('ALL');

  const filteredPosts = useMemo(() => {
    return filter === 'ALL' ? posts : posts.filter(p => p.status === filter);
  }, [posts, filter]);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const getStatusColor = (status: PostStatus) => {
      switch(status) {
          case 'SCHEDULED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'DECLINED': return 'bg-red-100 text-red-700 border-red-200';
          case 'APPROVED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
          default: return 'bg-slate-100';
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Global Timeline</h2>
            <p className="text-slate-500 font-mono text-xs mt-1">CROSS-PLATFORM DEPLOYMENT STATUS</p>
         </div>
         <div className="flex space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none min-w-[140px]">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full appearance-none bg-white border border-slate-300 px-4 py-2 pr-10 text-xs font-bold uppercase tracking-widest focus:border-indigo-600 outline-none cursor-pointer"
                >
                    <option value="ALL">All Units</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DECLINED">Declined</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 flex items-center space-x-2 shadow-sm transition-all active:scale-95">
                <Calendar size={14} />
                <span>Calendar</span>
            </button>
         </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
         <div className="grid grid-cols-12 gap-4 p-5 border-b border-slate-200 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-2">Deployment Timestamp</div>
            <div className="col-span-2">Target Node</div>
            <div className="col-span-4">Content Fragment</div>
            <div className="col-span-2">Context</div>
            <div className="col-span-2 text-right">State</div>
         </div>
         <div className="divide-y divide-slate-100 min-h-[400px]">
            {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400 font-mono text-xs italic">
                    <Filter size={32} className="mb-4 opacity-20" />
                    No units matching active filter profile.
                </div>
            ) : filteredPosts.map(post => (
                <div 
                    key={post.id} 
                    onClick={() => setSelectedPostId(post.id)}
                    className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-all group cursor-pointer border-l-4 ${selectedPostId === post.id ? 'bg-indigo-50/50 border-indigo-600' : 'border-transparent'}`}
                >
                    <div className="col-span-2 font-mono text-xs text-slate-800">
                        <span className="font-bold">{new Date(post.date).toLocaleDateString()}</span><br/>
                        <span className="text-slate-400">{new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="col-span-2">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase border tracking-tighter ${post.platform === 'Twitter' ? 'bg-sky-50 text-sky-700 border-sky-100' : post.platform === 'LinkedIn' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-pink-50 text-pink-700 border-pink-100'}`}>
                            {post.platform}
                        </span>
                    </div>
                    <div className="col-span-4 text-sm font-medium text-slate-900 truncate pr-6 group-hover:text-indigo-600 transition-colors">
                        {post.content}
                    </div>
                    <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        {post.campaign}
                    </div>
                    <div className="col-span-2 text-right flex justify-end items-center space-x-4">
                         <span className={`px-2 py-1 text-[10px] font-bold uppercase border tracking-widest ${getStatusColor(post.status)}`}>
                             {post.status.replace('_', ' ')}
                         </span>
                         <MoreHorizontal size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                </div>
            ))}
         </div>
      </div>

      {selectedPost && (
          <div className="fixed inset-y-0 right-0 z-[60] w-full md:w-[550px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-900 flex items-center justify-center border border-slate-700">
                          <AlertCircle size={22} className="text-indigo-500" />
                      </div>
                      <div>
                          <h3 className="font-black text-xl uppercase tracking-tighter italic leading-none">Management Console</h3>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mt-1">{selectedPost.platform} // ID_{selectedPost.id}</p>
                      </div>
                  </div>
                  <button onClick={() => {setSelectedPostId(null); setIsEditing(false);}} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                      <X size={20} className="text-slate-500" />
                  </button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto p-8">
                  <div className="flex items-center space-x-2">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active State</span>
                     <div className="flex-1 h-[1px] bg-slate-100"></div>
                  </div>
                  <div className={`p-5 border flex items-center justify-between shadow-sm ${getStatusColor(selectedPost.status)}`}>
                      <span className="text-xs font-black uppercase tracking-widest">Current: {selectedPost.status}</span>
                      <div className="flex space-x-2">
                          <button onClick={() => setPosts(prev => prev.map(p => p.id === selectedPost.id ? {...p, status: 'SCHEDULED'} : p))} className="px-3 py-1.5 bg-white text-emerald-600 border border-emerald-200 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95">Stage</button>
                          <button onClick={() => setPosts(prev => prev.map(p => p.id === selectedPost.id ? {...p, status: 'DECLINED'} : p))} className="px-3 py-1.5 bg-white text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95">Kill</button>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center">
                          <Clock size={12} className="mr-2 text-indigo-600" />
                          Injection Timestamp
                      </label>
                      <input 
                        type="datetime-local"
                        value={selectedPost.date}
                        onChange={(e) => setPosts(prev => prev.map(p => p.id === selectedPost.id ? {...p, date: e.target.value} : p))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 font-mono text-xs focus:border-indigo-600 outline-none transition-colors"
                      />
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Payload Content</label>
                          <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`text-[9px] font-black uppercase px-3 py-1 border transition-all ${isEditing ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                          >
                              {isEditing ? 'Lock Changes' : 'Override Copy'}
                          </button>
                      </div>
                      {isEditing ? (
                          <textarea 
                            value={selectedPost.content}
                            onChange={(e) => setPosts(prev => prev.map(p => p.id === selectedPost.id ? {...p, content: e.target.value} : p))}
                            className="w-full h-48 p-4 bg-slate-900 text-indigo-400 font-mono text-xs border-none outline-none leading-relaxed shadow-inner"
                          />
                      ) : (
                          <div className="p-6 bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap italic">
                              "{selectedPost.content}"
                          </div>
                      )}
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Asset Reference</label>
                      <div className="aspect-video bg-slate-900 border border-slate-800 relative overflow-hidden group/img">
                           <img src={`https://picsum.photos/seed/${selectedPost.id}/800/450`} alt="Asset preview" className="w-full h-full object-cover grayscale opacity-60 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-700" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                              <span className="bg-black/80 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-sm border border-white/10">Preview Active</span>
                           </div>
                      </div>
                  </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
                  <button 
                    onClick={() => { setSelectedPostId(null); setIsEditing(false); }}
                    className="flex-1 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg"
                  >
                      Sync Changes
                  </button>
                  <button className="px-6 py-4 border border-slate-300 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all">
                      <Trash2 size={18} />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default GlobalSchedule;
