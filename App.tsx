
import React, { useEffect } from 'react';
import { useAssistantStore } from './store/useAssistantStore';
import Dashboard from './pages/Dashboard';
import TrainingDetail from './pages/TrainingDetail';
import { SunIcon, MoonIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<'dashboard' | 'training'>('dashboard');
  const [activeAssistantId, setActiveAssistantId] = React.useState<string | null>(null);
  const { theme, toggleTheme } = useAssistantStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleTrain = (id: string) => {
    setActiveAssistantId(id);
    setCurrentPage('training');
  };

  const handleBack = () => {
    setActiveAssistantId(null);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      {/* ESTE ES EL CODIGO PARA LA BARRA DE NAVEGACION */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-fuchsia-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg italic">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 dark:from-fuchsia-400 dark:to-fuchsia-300">
              Prueba
            </span>
            <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">
              BETA
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500 dark:text-slate-400">
              <button className="text-indigo-600 dark:text-indigo-400">Asistentes</button>
              <button className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Campañas</button>
              <button className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Leads</button>
            </div>

            <div className="flex items-center pl-6 border-l border-slate-200 dark:border-slate-800 space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
              </button>
              <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pb-12">
        {currentPage === 'dashboard' ? (
          <Dashboard onTrain={handleTrain} />
        ) : (
          activeAssistantId && (
            <TrainingDetail 
              id={activeAssistantId} 
              onBack={handleBack} 
            />
          )
        )}
      </main>

      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-400 dark:text-slate-500">
        <p>&copy; 2026 Prueba. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
