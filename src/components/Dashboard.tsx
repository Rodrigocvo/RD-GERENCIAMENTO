import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  History, 
  BarChart3, 
  LayoutDashboard,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ArrowRight,
  Sun,
  Moon,
  DownloadCloud,
  ChevronRight,
  Smartphone,
  Monitor,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import RegisterBet from './views/RegisterBet';
import { storage } from '../lib/storage';

// Types
type ViewState = 'dashboard' | 'register' | 'analysis' | 'history' | 'install';

export interface BetData {
  id: string;
  date: string;
  event: string;
  market: string;
  result: string;
  roi: string;
  type: 'win' | 'loss';
  odds?: string;
  stake?: string;
  bonusPercent?: string;
}

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [bets, setBets] = useState<BetData[]>([]);
  const [editingBet, setEditingBet] = useState<BetData | null>(null);
  const [analysisContext, setAnalysisContext] = useState<string>('Geral');
  const [initialBankroll, setInitialBankrollState] = useState(10000);
  const [isEditingBankroll, setIsEditingBankroll] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    setBets(storage.getBets());
    setInitialBankrollState(storage.getBankroll());
  }, []);

  // Relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateInitialBankroll = (value: number) => {
    setInitialBankrollState(value);
    storage.saveBankroll(value);
    setIsEditingBankroll(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir esta aposta?')) {
      const newBets = bets.filter(b => b.id !== id);
      setBets(newBets);
      storage.saveBets(newBets);
    }
  };

  const handleEdit = (bet: BetData) => {
    setEditingBet(bet);
    setActiveView('register');
  };

  const onSaveBet = (betData: any) => {
    const oddsV = parseFloat(betData.odds) || 0;
    const bonusV = parseFloat(betData.bonusPercent || '0') || 0;
    const boostedV = oddsV * (1 + bonusV / 100);
    
    const roiValue = betData.result === 'win' 
      ? `+${((boostedV - 1) * 100).toFixed(0)}%` 
      : betData.result === 'loss' ? '-100%' : 'Pendente';

    let updatedBets: BetData[];
    if (editingBet) {
      updatedBets = bets.map(b => b.id === editingBet.id ? { 
        ...betData, 
        id: b.id, 
        type: betData.result === 'win' ? 'win' : betData.result === 'loss' ? 'loss' : 'win', 
        roi: roiValue 
      } : b);
      setEditingBet(null);
    } else {
      const newBet = {
        ...betData,
        id: Date.now().toString(),
        type: betData.result === 'win' ? 'win' : betData.result === 'loss' ? 'loss' : 'win',
        roi: roiValue
      };
      updatedBets = [newBet, ...bets];
    }
    
    setBets(updatedBets);
    storage.saveBets(updatedBets);
    setActiveView('history');
  };

  // Cálculos de Performance
  const stats = React.useMemo(() => {
    const closedBets = bets.filter(b => b.result !== 'pending');
    const wins = closedBets.filter(b => b.type === 'win').length;
    const losses = closedBets.filter(b => b.type === 'loss').length;
    const winRate = closedBets.length > 0 ? (wins / closedBets.length) * 100 : 0;
    
    const profit = bets.reduce((acc, bet) => {
      if (bet.result === 'pending') return acc;
      const stakeVal = parseFloat(bet.stake || '0');
      const oddsVal = parseFloat(bet.odds || '0');
      const bonusVal = parseFloat(bet.bonusPercent || '0');
      const boostedOdds = oddsVal * (1 + bonusVal / 100);
      
      if (bet.type === 'win') return acc + (stakeVal * (boostedOdds - 1));
      return acc - stakeVal;
    }, 0);

    return { wins, losses, winRate, profit };
  }, [bets]);

  const currentBankroll = initialBankroll + stats.profit;

  // Renderização das Views
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans",
      isDark ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-900"
    )}>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <TrendingUp className="text-primary" size={24} />
            </div>
            <div>
               <h1 className="font-headline text-lg font-bold text-primary leading-none">RD GERENCIAMENTO</h1>
               <span className="text-[10px] text-on-surface-variant font-label-mono">SALVAMENTO LOCAL ATIVO</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={onLogout} title="Sair" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-500/10 text-red-500 border border-red-500/20">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div key="dashboard" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Banca Atual" value={`R$ ${currentBankroll.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} trend={stats.profit >= 0 ? 'up' : 'down'} />
                <StatCard title="Lucro/Prejuízo" value={`R$ ${stats.profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} trend={stats.profit >= 0 ? 'up' : 'down'} />
                <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} trend="none" />
                <div className="bg-primary-container p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
                   <span className="text-xs font-bold uppercase tracking-wider text-on-primary-container opacity-70">Banca Inicial</span>
                   <div className="flex items-center justify-between mt-2">
                      {isEditingBankroll ? (
                        <div className="flex gap-2 w-full">
                          <input type="number" className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-full outline-none" autoFocus 
                            onKeyDown={(e) => e.key === 'Enter' && updateInitialBankroll(parseFloat(e.currentTarget.value) || 0)}
                          />
                        </div>
                      ) : (
                        <span className="text-2xl font-mono font-bold text-on-primary-container">R$ {initialBankroll.toLocaleString()}</span>
                      )}
                      <button onClick={() => setIsEditingBankroll(!isEditingBankroll)} className="text-on-primary-container hover:bg-white/10 p-2 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <button onClick={() => setActiveView('register')} className="md:col-span-1 bg-primary text-white p-6 rounded-3xl flex flex-col items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 group">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform"><Plus size={32} /></div>
                    <span className="font-headline text-lg font-bold">Nova Aposta</span>
                 </button>
                 <div className="md:col-span-2 bg-surface-container rounded-3xl p-6 border border-outline-variant/30">
                    <h3 className="font-headline text-lg font-bold mb-4">Ações Rápidas</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <QuickAction onClick={() => setActiveView('history')} icon={<History />} label="Ver Histórico" color="secondary" />
                       <QuickAction onClick={() => window.open('https://www.google.com/search?q=livescore', '_blank')} icon={<ExternalLink />} label="Resultados ao Vivo" color="tertiary" />
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeView === 'register' && (
            <RegisterBet onSave={onSaveBet} onCancel={() => setActiveView('dashboard')} initialData={editingBet} />
          )}

          {activeView === 'history' && (
            <motion.div key="history" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-headline text-2xl font-bold">Histórico de Performance</h2>
              </div>
              <div className="grid gap-3">
                {bets.length === 0 ? (
                  <div className="text-center py-20 bg-surface-container rounded-3xl border border-dashed border-outline-variant">
                    <Clock size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-on-surface-variant font-medium">Nenhuma aposta registrada ainda.</p>
                  </div>
                ) : (
                  bets.map(bet => (
                    <div key={bet.id} className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 flex items-center gap-4 hover:border-primary/30 transition-colors">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", bet.type === 'win' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')}>
                        {bet.type === 'win' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-title-md truncate">{bet.event}</h4>
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium mt-1">
                          <span>{bet.market}</span>
                          <span className="w-1 h-1 bg-outline rounded-full"></span>
                          <span>{bet.date}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                         <span className={cn("font-mono font-bold", bet.type === 'win' ? 'text-emerald-500' : 'text-rose-500')}>{bet.roi}</span>
                         <div className="flex gap-2">
                           <button onClick={() => handleEdit(bet)} className="p-1 hover:bg-primary/10 rounded transition-colors text-primary"><Edit2 size={16}/></button>
                           <button onClick={() => handleDelete(bet.id)} className="p-1 hover:bg-rose-500/10 rounded transition-colors text-rose-500"><Trash2 size={16}/></button>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'install' && (
             <div className="text-center p-20">Instruções de instalação PWA...</div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 px-6 py-3 flex justify-between items-center md:hidden">
        <NavItem active={activeView === 'dashboard'} icon={<LayoutDashboard />} label="Dashboard" onClick={() => setActiveView('dashboard')} />
        <NavItem active={activeView === 'history'} icon={<History />} label="Histórico" onClick={() => setActiveView('history')} />
        <NavItem active={activeView === 'register'} icon={<Plus />} label="Nova" onClick={() => setActiveView('register')} />
        <NavItem active={activeView === 'install'} icon={<DownloadCloud />} label="Baixar" onClick={() => setActiveView('install')} />
      </nav>
    </div>
  );
}

// Auxiliares
function StatCard({ title, value, trend }: any) {
  return (
    <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 flex flex-col justify-between hover:border-primary/20 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{title}</span>
        {trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
        {trend === 'down' && <TrendingDown size={16} className="text-rose-500" />}
      </div>
      <span className="text-2xl font-mono font-bold mt-2 truncate">{value}</span>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-4 bg-surface-container-high rounded-2xl border border-outline-variant/20 hover:bg-primary/5 hover:border-primary/20 transition-all active:scale-95">
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-tight text-on-surface-variant">{label}</span>
    </button>
  );
}

function NavItem({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 p-2 rounded-xl transition-all", active ? "text-primary scale-110" : "text-on-surface-variant opacity-60")}>
      {React.cloneElement(icon, { size: 24 })}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
