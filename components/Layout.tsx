
import React from 'react';
import { LayoutDashboard, PenTool, Calendar, Settings, FileText, Menu, X as XIcon } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: AppView }) => (
    <div 
      onClick={() => {
        onNavigate(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 px-6 py-4 cursor-pointer transition-all border-l-4 ${currentView === view ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <Icon size={20} />
      <span className="font-bold text-xs tracking-widest uppercase">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center shadow-sm rounded-none">
                <PenTool className="text-white" size={18} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">ContentFlow</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
              <XIcon size={24} />
            </button>
          </div>

          <nav className="flex-1 py-6 space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" view="DASHBOARD" />
            <NavItem icon={FileText} label="Campaigns" view="CAMPAIGNS" />
            <NavItem icon={Calendar} label="Global Schedule" view="SCHEDULE" />
            <NavItem icon={Settings} label="Settings" view="SETTINGS" />
          </nav>

          {/* User profile section removed as per request */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-slate-500 mr-4">
              <Menu size={24} />
            </button>
           </div>
           <div className="flex-1">
             <h1 className="text-xl font-black text-slate-800 uppercase tracking-widest">
               {currentView}
             </h1>
           </div>
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">System Online</span>
             </div>
           </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-100">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
