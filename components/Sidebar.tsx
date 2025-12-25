
import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  History, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Panel Principal', icon: LayoutDashboard },
    { id: View.UPLOAD, label: 'Mis Documentos', icon: FileText },
    { id: View.CONFIG, label: 'Generar Examen', icon: BrainCircuit },
    { id: View.HISTORY, label: 'Progreso e Historial', icon: History },
    { id: View.SETTINGS, label: 'Personalización', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-background-dark border-r border-surface-border flex flex-col shrink-0 z-20 transition-all duration-300">
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="flex gap-3 items-center mb-10 mt-2 px-2 cursor-pointer group" onClick={() => onNavigate(View.DASHBOARD)}>
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary transition-transform group-hover:rotate-12">
              <GraduationCap size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-main text-xl font-black tracking-tight">StudyGen</h1>
              <p className="text-primary font-black text-[9px] uppercase tracking-[0.2em] leading-none">Membresía Premium</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                      : 'text-text-main/40 hover:bg-surface-dark hover:text-text-main'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                  <span className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-surface-border">
          <button className="flex w-full items-center gap-4 px-4 py-3 text-danger/60 hover:text-danger hover:bg-danger/10 rounded-xl transition-all font-bold group">
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
