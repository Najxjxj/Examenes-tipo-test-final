
import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Download, 
  PlusCircle, 
  Search, 
  FileText, 
  RefreshCw,
  LayoutDashboard,
  Target,
  Trophy,
  Brain,
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ExamSession } from '../../types';

interface HistoryViewProps {
  sessions: ExamSession[];
  onStart: (session: ExamSession) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ sessions, onStart }) => {
  // Procesar estadísticas dinámicas basadas solo en las sesiones reales
  const stats = useMemo(() => {
    if (sessions.length === 0) return null;

    const totalTests = sessions.length;
    
    // Promedio global de precisión (%)
    const avgScore = Math.round(
      sessions.reduce((acc, s) => acc + (s.score / s.totalQuestions) * 100, 0) / totalTests
    );

    // Tiempo medio por pregunta
    const totalQuestionsDone = sessions.reduce((acc, s) => acc + s.totalQuestions, 0);
    const totalTimeSpent = sessions.reduce((acc, s) => acc + (s.timeElapsed || 0), 0);
    const avgPace = totalQuestionsDone > 0 ? Math.round(totalTimeSpent / totalQuestionsDone) : 0;

    // Agrupar por tema para encontrar fortalezas y debilidades
    const topics: Record<string, { total: number, correct: number, count: number }> = {};
    sessions.forEach(s => {
      if (!topics[s.topic]) topics[s.topic] = { total: 0, correct: 0, count: 0 };
      topics[s.topic].total += s.totalQuestions;
      topics[s.topic].correct += s.score;
      topics[s.topic].count += 1;
    });

    const topicStats = Object.entries(topics).map(([name, data]) => ({
      name,
      percentage: Math.round((data.correct / data.total) * 100),
      count: data.count
    }));

    const bestTopic = [...topicStats].sort((a, b) => b.percentage - a.percentage)[0]?.name || 'N/A';
    const weakPoints = topicStats.filter(t => t.percentage < 75).sort((a, b) => a.percentage - b.percentage).slice(0, 3);

    // Datos para el gráfico de evolución (últimos 15 tests)
    const evolutionData = [...sessions].reverse().slice(-15).map((s, idx) => ({
      name: `Test ${idx + 1}`,
      score: Math.round((s.score / s.totalQuestions) * 100),
      topic: s.topic,
      raw: `${s.score}/${s.totalQuestions}`
    }));

    return {
      totalTests,
      avgScore,
      avgPace,
      bestTopic,
      evolutionData,
      weakPoints
    };
  }, [sessions]);

  // Si no hay sesiones, mostrar pantalla de estado inicial limpia
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-10 animate-in fade-in zoom-in duration-700">
        <div className="size-40 rounded-[3rem] bg-surface-dark border border-white/5 flex items-center justify-center text-white/10 mb-10 shadow-2xl relative">
          <Brain size={80} strokeWidth={1} />
          <div className="absolute -top-2 -right-2 size-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 animate-pulse">
            <Zap size={24} />
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Tu historial está vacío</h2>
        <p className="text-[#92adc9] text-xl max-w-md mb-12 leading-relaxed font-medium">
          Completa tu primer test para empezar a trackear tu progreso, precisión y velocidad de estudio.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="group flex items-center gap-4 px-10 h-18 bg-primary text-white text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95"
        >
          <PlusCircle size={24} />
          <span>Empezar Primera Sesión</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em] mb-3">
            <BarChart3 size={16} /> Analítica de Estudiante
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Mi Progreso Real</h1>
          <p className="text-[#92adc9] text-lg mt-4 font-medium">Análisis detallado de tus últimas {sessions.length} sesiones de estudio.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 h-14 bg-surface-dark border border-white/5 text-white/60 rounded-2xl hover:bg-white/5 transition-all text-sm font-black shadow-xl">
            <Download size={18} /> Exportar Reporte
          </button>
        </div>
      </div>

      {/* Grid de KPIs Dinámicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tests Completados', value: stats?.totalTests, icon: LayoutDashboard, color: 'text-primary', bg: 'bg-primary/10', detail: 'Volumen de estudio' },
          { label: 'Precisión Media', value: `${stats?.avgScore}%`, icon: Target, color: 'text-success', bg: 'bg-success/10', detail: 'Tasa de acierto global' },
          { label: 'Velocidad Media', value: `${stats?.avgPace}s`, icon: Clock, color: 'text-warning', bg: 'bg-warning/10', detail: 'Tiempo por pregunta' },
          { label: 'Tema Dominante', value: stats?.bestTopic, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10', detail: 'Mejor rendimiento' }
        ].map((item, i) => (
          <div key={i} className="bg-surface-dark p-8 rounded-[2rem] border border-white/5 shadow-2xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92adc9]">{item.label}</span>
              <div className={`p-3 ${item.bg} ${item.color} rounded-2xl group-hover:scale-110 transition-transform`}><item.icon size={20} /></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white truncate mb-1">{item.value}</span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fila de Gráficos y Debilidades */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Gráfico de Evolución de Puntuación */}
        <div className="xl:col-span-2 bg-surface-dark p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Curva de Aprendizaje</h3>
              <p className="text-sm text-[#92adc9] font-medium mt-1">Tu rendimiento test a test</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background-dark border border-white/5 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest">
              <TrendingUp size={14} className="text-primary" /> Tendencia de Precisión
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.evolutionData}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4e5e6e" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  stroke="#4e5e6e" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#17232e', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    padding: '16px'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '14px' }}
                  labelStyle={{ color: '#92adc9', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  cursor={{ stroke: '#137fec', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#137fec" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#scoreColor)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Puntos de Refuerzo (Inteligente) */}
        <div className="bg-surface-dark p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Temas a Reforzar</h3>
            <p className="text-sm text-[#92adc9] font-medium mt-1">Identificados por bajo rendimiento</p>
          </div>
          
          <div className="flex-1 space-y-10">
            {stats && stats.weakPoints.length > 0 ? (
              stats.weakPoints.map((topic, i) => (
                <div key={i} className="space-y-4 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-white/80 group-hover:text-white transition-colors uppercase tracking-tight truncate max-w-[75%]">
                      {topic.name}
                    </span>
                    <span className={`text-lg font-black ${topic.percentage < 50 ? 'text-danger' : 'text-warning'}`}>
                      {topic.percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-background-dark rounded-full overflow-hidden shadow-inner border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${topic.percentage < 50 ? 'bg-danger shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-warning shadow-[0_0_15px_rgba(245,158,11,0.4)]'}`} 
                      style={{ width: `${topic.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="size-20 rounded-3xl bg-success/10 text-success flex items-center justify-center mb-6">
                  <Trophy size={40} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-success">¡Excelente nivel global!</p>
                <p className="text-[10px] text-white/40 mt-2">Sigue así, no hay temas críticos.</p>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-10 border-t border-white/5">
            <p className="text-[10px] font-black text-[#4e5e6e] uppercase tracking-widest leading-relaxed">
              * El sistema sugiere repasar documentos con menos del 75% de acierto acumulado.
            </p>
          </div>
        </div>
      </div>

      {/* Historial Detallado */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <h3 className="text-3xl font-black text-white tracking-tighter">Historial Completo</h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar por documento..." 
              className="w-full h-12 bg-surface-dark border border-white/5 text-white text-sm rounded-xl pl-12 pr-6 outline-none focus:border-primary/50 transition-all shadow-xl"
            />
          </div>
        </div>

        <div className="bg-surface-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b141d]/50 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#92adc9]">
                <th className="px-10 py-6">Sesión</th>
                <th className="px-10 py-6">Documento Origen</th>
                <th className="px-10 py-6">Fecha</th>
                <th className="px-10 py-6">Precisión</th>
                <th className="px-10 py-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map(s => {
                const perc = Math.round((s.score / s.totalQuestions) * 100);
                return (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className={`size-12 rounded-2xl flex items-center justify-center border-2 ${
                          perc >= 80 ? 'bg-success/10 text-success border-success/20 shadow-success/5' : 
                          perc >= 50 ? 'bg-warning/10 text-warning border-warning/20 shadow-warning/5' : 
                          'bg-danger/10 text-danger border-danger/20 shadow-danger/5'
                        }`}>
                          <FileText size={22} />
                        </div>
                        <span className="text-white font-black text-base">{s.title.replace('Test Maestro: ', '')}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[#92adc9] text-sm font-black uppercase tracking-tight truncate max-w-[180px]">{s.topic}</td>
                    <td className="px-10 py-8 text-[#92adc9] text-sm font-bold">{s.date}</td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-black border-2 ${
                        perc >= 80 ? 'bg-success/10 text-success border-success/20' : 
                        perc >= 50 ? 'bg-warning/10 text-warning border-warning/20' : 
                        'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {s.score} / {s.totalQuestions}
                        <div className={`size-2 rounded-full animate-pulse ${perc >= 80 ? 'bg-success' : perc >= 50 ? 'bg-warning' : 'bg-danger'}`}></div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => onStart(s)}
                        className="size-12 bg-white/5 hover:bg-primary hover:text-white text-slate-400 rounded-2xl transition-all inline-flex items-center justify-center group/btn shadow-inner"
                        title="Reintentar este Test"
                      >
                        <RefreshCw size={20} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
