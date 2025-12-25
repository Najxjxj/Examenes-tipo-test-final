
import React from 'react';
import { 
  Moon, 
  Sun, 
  Palette, 
  Trash2, 
  Check,
  Camera,
  Heart,
  Zap,
  Flame,
  Leaf,
  Type as TypeIcon,
  Monitor
} from 'lucide-react';

type ThemeMode = 'dark' | 'light' | 'black' | 'red' | 'green';

interface SettingsViewProps {
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentAccent: string;
  setAccent: (color: string) => void;
  currentFont: string;
  setFont: (font: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  currentTheme, 
  setTheme, 
  currentAccent, 
  setAccent,
  currentFont,
  setFont
}) => {
  const accentColors = [
    { name: 'Océano', value: '#137fec' },
    { name: 'Obsidiana', value: '#334155' },
    { name: 'Amatista', value: '#8b5cf6' },
    { name: 'Esmeralda', value: '#10b981' },
    { name: 'Escarlata', value: '#ef4444' },
    { name: 'Coral', value: '#f43f5e' },
    { name: 'Ámbar', value: '#f59e0b' },
    { name: 'Fucsia', value: '#d946ef' },
    { name: 'Cian', value: '#06b6d4' },
  ];

  const themeModes = [
    { id: 'dark', label: 'Obsidiana', icon: Moon, desc: 'Balanceado.', color: 'bg-[#17232e]' },
    { id: 'light', label: 'Nieve', icon: Sun, desc: 'Luminoso.', color: 'bg-[#f1f5f9]' },
    { id: 'black', label: 'Negro OLED', icon: Zap, desc: 'Contraste puro.', color: 'bg-black' },
    { id: 'red', label: 'Carmesí', icon: Flame, desc: 'Tono cálido.', color: 'bg-[#1a0808]' },
    { id: 'green', label: 'Bosque', icon: Leaf, desc: 'Natural.', color: 'bg-[#081a0e]' },
  ];

  const fonts = [
    { id: 'Lexend', name: 'Lexend', desc: 'Moderna y optimizada para lectura rápida.', style: { fontFamily: 'Lexend' } },
    { id: 'Inter', name: 'Inter', desc: 'La fuente estándar del diseño UI profesional.', style: { fontFamily: 'Inter' } },
    { id: 'Outfit', name: 'Outfit', desc: 'Geométrica, elegante y con personalidad propia.', style: { fontFamily: 'Outfit' } },
    { id: 'Playfair Display', name: 'Playfair', desc: 'Estilo clásico y sofisticado para encabezados.', style: { fontFamily: 'Playfair Display' } },
    { id: 'JetBrains Mono', name: 'JetBrains', desc: 'Inspirada en el código, perfecta para precisión técnica.', style: { fontFamily: 'JetBrains Mono' } },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-text-main tracking-tighter">Configuración y Estilo</h1>
        <p className="text-text-main/60 text-lg font-medium">Personaliza cada detalle de tu experiencia de aprendizaje.</p>
      </div>

      {/* Bloque: Apariencia */}
      <div className="bg-surface-dark rounded-[2.5rem] border border-surface-border shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-surface-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-4">
            <Palette size={24} className="text-primary" />
            <div>
              <h3 className="text-xl font-black text-text-main">Estética del Sistema</h3>
              <p className="text-text-main/40 text-[10px] font-black uppercase tracking-[0.2em]">Modos de Visualización</p>
            </div>
          </div>
          <Monitor size={20} className="text-primary/40" />
        </div>
        
        <div className="p-10 space-y-12">
          {/* Selector de Temas */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-text-main/60 uppercase tracking-[0.2em]">Modo de Fondo</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {themeModes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as ThemeMode)}
                  className={`group relative flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all duration-300 ${
                    currentTheme === t.id 
                      ? 'border-primary bg-primary/5 shadow-xl scale-[1.05]' 
                      : 'border-surface-border hover:border-text-main/20 hover:bg-text-main/5'
                  }`}
                >
                  <div className={`size-10 rounded-xl transition-all flex items-center justify-center ${t.color} border border-white/10 ${currentTheme === t.id ? 'shadow-lg' : ''}`}>
                    <t.icon size={18} className={currentTheme === t.id ? 'text-primary' : 'text-text-main/40'} />
                  </div>
                  <span className={`text-[10px] font-black tracking-tight ${currentTheme === t.id ? 'text-text-main' : 'text-text-main/40'}`}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Acento */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-text-main/60 uppercase tracking-[0.2em]">Color de Acento Principal</h4>
            <div className="flex flex-wrap gap-4">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccent(color.value)}
                  className="group flex flex-col items-center gap-3"
                >
                  <div 
                    className={`size-12 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center relative ${
                      currentAccent === color.value 
                        ? 'border-white scale-110 shadow-xl' 
                        : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.value, boxShadow: currentAccent === color.value ? `0 10px 20px ${color.value}44` : 'none' }}
                  >
                    {currentAccent === color.value && <Check size={20} className="text-white drop-shadow-md" strokeWidth={4} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloque: Tipografía */}
      <div className="bg-surface-dark rounded-[2.5rem] border border-surface-border shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-surface-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-4">
            <TypeIcon size={24} className="text-primary" />
            <div>
              <h3 className="text-xl font-black text-text-main">Tipografía del Lector</h3>
              <p className="text-text-main/40 text-[10px] font-black uppercase tracking-[0.2em]">Fuentes del sistema</p>
            </div>
          </div>
        </div>
        
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`flex items-start gap-6 p-6 rounded-[2rem] border-2 transition-all duration-500 text-left relative overflow-hidden ${
                currentFont === f.id 
                  ? 'border-primary bg-primary/5 shadow-xl' 
                  : 'border-surface-border hover:border-text-main/20 hover:bg-text-main/5'
              }`}
            >
              <div className={`shrink-0 size-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                currentFont === f.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-background-dark text-text-main/20 border-surface-border'
              }`}>
                <span className="text-2xl font-black" style={f.style}>Aa</span>
              </div>
              <div>
                <p className="font-black text-lg text-text-main" style={f.style}>{f.name}</p>
                <p className="text-xs font-medium text-text-main/40 mt-1 leading-relaxed">{f.desc}</p>
              </div>
              {currentFont === f.id && (
                <div className="absolute top-4 right-6 text-primary animate-scale-in">
                  <Check size={20} strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Perfil (Simplificado para consistencia) */}
      <div className="bg-surface-dark rounded-[2.5rem] border border-surface-border shadow-2xl overflow-hidden group">
        <div className="p-10 border-b border-surface-border flex flex-col md:flex-row gap-8 items-center">
          <div className="relative group/avatar">
            <div 
              className="size-32 rounded-full border-4 border-surface-border bg-center bg-cover shadow-2xl group-hover/avatar:scale-105 transition-transform duration-700"
              style={{ backgroundImage: 'url("https://picsum.photos/300")' }}
            ></div>
            <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-text-main tracking-tight">Juan Pérez</h3>
            <p className="text-text-main/40 font-bold uppercase tracking-widest text-[10px] mt-2">Miembro Premium • ID: 4892-STUDY</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <button className="px-8 py-3 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95">Actualizar Cuenta</button>
            </div>
          </div>
        </div>

        <div className="p-10 grid md:grid-cols-2 gap-8 bg-background-dark/20">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest px-1">Nombre Completo</label>
            <input type="text" defaultValue="Juan Pérez" className="w-full h-14 rounded-2xl bg-surface-dark border-surface-border text-text-main focus:ring-4 focus:ring-primary/10 transition-all px-6 font-bold" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest px-1">Dirección de Correo</label>
            <input type="email" defaultValue="juan.perez@estudiante.com" className="w-full h-14 rounded-2xl bg-surface-dark border-surface-border text-text-main focus:ring-4 focus:ring-primary/10 transition-all px-6 font-bold" />
          </div>
        </div>
      </div>

      <div className="bg-danger/5 rounded-[2.5rem] border border-danger/20 p-10 flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="flex items-start gap-6">
          <div className="p-5 bg-danger/10 text-danger rounded-2xl group-hover:bg-danger group-hover:text-white transition-all duration-500 shadow-lg shadow-danger/5">
            <Trash2 size={28} />
          </div>
          <div>
            <h3 className="text-text-main font-black text-2xl mb-1 tracking-tight">Zona Crítica</h3>
            <p className="text-text-main/40 text-sm max-w-sm font-medium leading-relaxed">Al eliminar tus datos, se perderá permanentemente toda tu evolución académica y archivos cargados.</p>
          </div>
        </div>
        <button className="px-10 h-16 bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 rounded-2xl font-black transition-all active:scale-95">
          Eliminar Datos
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
