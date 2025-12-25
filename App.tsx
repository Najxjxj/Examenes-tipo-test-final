
import React, { useState, useEffect } from 'react';
import { View, AppState, FileData, ExamSession, StudyMode } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/views/DashboardView';
import UploadView from './components/views/UploadView';
import ConfigView from './components/views/ConfigView';
import PracticeView from './components/views/PracticeView';
import ExamModeView from './components/views/ExamModeView';
import ResultsView from './components/views/ResultsView';
import HistoryView from './components/views/HistoryView';
import SettingsView from './components/views/SettingsView';

export type ThemeMode = 'dark' | 'light' | 'black' | 'red' | 'green';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: View.DASHBOARD,
    files: [],
    sessions: [],
    activeSession: null
  });

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState('#137fec');
  const [fontFamily, setFontFamily] = useState('Lexend');
  const [referenceContext, setReferenceContext] = useState<string | undefined>();

  useEffect(() => {
    const body = document.body;
    body.classList.remove('light-theme', 'theme-black', 'theme-red', 'theme-green', 'dark');
    
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else if (theme === 'black') {
      body.classList.add('theme-black', 'dark');
    } else if (theme === 'red') {
      body.classList.add('theme-red', 'dark');
    } else if (theme === 'green') {
      body.classList.add('theme-green', 'dark');
    } else {
      body.classList.add('dark');
    }
    
    document.documentElement.style.setProperty('--primary-color', accentColor);
    document.documentElement.style.setProperty('--primary-dark-color', accentColor + 'cc');
    document.documentElement.style.setProperty('--font-family', fontFamily);
  }, [theme, accentColor, fontFamily]);

  const navigateTo = (view: View) => {
    setState(prev => ({ ...prev, view }));
  };

  const handleStartExam = (session: ExamSession) => {
    setState(prev => ({
      ...prev,
      activeSession: session,
      view: session.mode === StudyMode.PRACTICE ? View.PRACTICE : View.EXAM
    }));
  };

  const handleFinishExam = (results: ExamSession) => {
    setState(prev => ({
      ...prev,
      activeSession: results,
      sessions: [results, ...prev.sessions],
      view: View.RESULTS
    }));
  };

  const handleExit = () => {
    setState(prev => ({
      ...prev,
      activeSession: null,
      view: View.DASHBOARD
    }));
  };

  // Vistas que no muestran la barra lateral ni el header estándar
  const isImmersiveMode = [View.PRACTICE, View.EXAM].includes(state.view);

  const renderView = () => {
    switch (state.view) {
      case View.DASHBOARD:
        return <DashboardView 
          onUpload={() => navigateTo(View.UPLOAD)} 
          onStartExam={() => navigateTo(View.CONFIG)}
          recentFiles={state.files}
          recentSessions={state.sessions}
        />;
      case View.UPLOAD:
        return <UploadView 
          onFilesReady={(files, refText) => {
            setState(prev => ({ ...prev, files: [...files, ...prev.files] }));
            setReferenceContext(refText);
            navigateTo(View.CONFIG);
          }}
          onCancel={() => navigateTo(View.DASHBOARD)}
        />;
      case View.CONFIG:
        return <ConfigView 
          files={state.files.filter(f => f.status === 'ready')}
          referenceText={referenceContext}
          onGenerate={(session) => handleStartExam(session)}
        />;
      case View.PRACTICE:
        return state.activeSession ? (
          <PracticeView 
            session={state.activeSession}
            onFinish={handleFinishExam}
            onExit={handleExit}
          />
        ) : <DashboardView onUpload={() => navigateTo(View.UPLOAD)} onStartExam={() => navigateTo(View.CONFIG)} recentFiles={state.files} recentSessions={state.sessions} />;
      case View.EXAM:
        return state.activeSession ? (
          <ExamModeView 
            session={state.activeSession}
            onFinish={handleFinishExam}
          />
        ) : null;
      case View.RESULTS:
        return state.activeSession ? (
          <ResultsView 
            session={state.activeSession}
            onRetry={() => handleStartExam(state.activeSession!)}
            onNew={() => navigateTo(View.UPLOAD)}
          />
        ) : null;
      case View.HISTORY:
        return <HistoryView sessions={state.sessions} onStart={handleStartExam} />;
      case View.SETTINGS:
        return <SettingsView 
          currentTheme={theme} 
          setTheme={setTheme} 
          currentAccent={accentColor} 
          setAccent={setAccentColor}
          currentFont={fontFamily}
          setFont={setFontFamily}
        />;
      default:
        return <DashboardView onUpload={() => navigateTo(View.UPLOAD)} onStartExam={() => navigateTo(View.CONFIG)} recentFiles={state.files} recentSessions={state.sessions} />;
    }
  };

  const getTitle = () => {
    switch(state.view) {
      case View.DASHBOARD: return "Panel de Control";
      case View.UPLOAD: return "Gestión de Materiales";
      case View.CONFIG: return "Configurar Evaluación";
      case View.PRACTICE: return "Modo de Práctica";
      case View.EXAM: return "Sesión de Examen";
      case View.RESULTS: return "Resultados del Análisis";
      case View.HISTORY: return "Evolución Académica";
      case View.SETTINGS: return "Ajustes del Sistema";
      default: return "StudyGen";
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden font-main">
      {!isImmersiveMode && (
        <Sidebar activeView={state.view} onNavigate={navigateTo} />
      )}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {!isImmersiveMode && (
          <Header 
            title={getTitle()} 
            onLogout={() => {}}
          />
        )}
        <main className={`flex-1 overflow-y-auto custom-scrollbar ${isImmersiveMode ? '' : 'p-4 md:p-8'}`}>
          <div className={`${isImmersiveMode ? 'h-full' : 'animate-fade-in-up'}`}>
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
