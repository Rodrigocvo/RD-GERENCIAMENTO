import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  History,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import RegisterBet from './views/RegisterBet';

// Types
type ViewState = 'dashboard' | 'register' | 'analysis' | 'history';

interface BetData {
  id: number;
  date: string;
  event: string;
  market: string;
  result: string;
  roi: string;
  type: 'win' | 'loss';
  odds?: string;
  stake?: string;
}

// Initial Mock data
const initialHistory: BetData[] = [
  { id: 1, date: '28/05/2024', event: 'Real Madrid vs Dortmund', market: 'Over 2.5 Goals', result: 'Ganha', roi: '+85%', type: 'win', odds: '1.85', stake: '100' },
  { id: 2, date: '27/05/2024', event: 'Lakers vs Nuggets', market: 'Moneyline Home', result: 'Perdida', roi: '-100%', type: 'loss', odds: '1.90', stake: '50' },
  { id: 3, date: '26/05/2024', event: 'Palmeiras vs Flamengo', market: 'BTTS Yes', result: 'Ganha', roi: '+110%', type: 'win', odds: '2.10', stake: '80' },
  { id: 4, date: '25/05/2024', event: 'Man City vs Man Utd', market: 'Asian Handicap -1.5', result: 'Perdida', roi: '-100%', type: 'loss', odds: '1.75', stake: '120' },
  { id: 5, date: '24/05/2024', event: 'Celtics vs Pacers', market: 'Total Under 210.5', result: 'Ganha', roi: '+92%', type: 'win', odds: '1.92', stake: '100' },
];

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [bets, setBets] = useState<BetData[]>(initialHistory);
  const [editingBet, setEditingBet] = useState<BetData | null>(null);
  const [analysisContext, setAnalysisContext] = useState<string>('Geral');
  const [initialBankroll, setInitialBankroll] = useState(10000);
  const [isEditingBankroll, setIsEditingBankroll] = useState(false);

  // Dynamic Calculations
  const stats = React.useMemo(() => {
    const closedBets = bets.filter(b => b.result !== 'pending');
    
    let totalProfit = 0;
    let totalStaked = 0;
    let sumOdds = 0;
    
    closedBets.forEach(bet => {
      const odd = parseFloat(bet.odds || '0');
      const stake = parseFloat(bet.stake || '0');
      const bonus = parseFloat(bet.bonusPercent || '0') || 0;
      const effectiveOdd = odd * (1 + bonus / 100);
      
      totalStaked += stake;
      sumOdds += odd;
      
      if (bet.result === 'win' || bet.result === 'Ganha') {
        totalProfit += stake * (effectiveOdd - 1);
      } else if (bet.result === 'loss' || bet.result === 'Perdida') {
        totalProfit -= stake;
      }
    });

    const avgOdds = closedBets.length > 0 ? (sumOdds / closedBets.length).toFixed(2) : '0.00';
    const balance = initialBankroll + totalProfit;
    
    // Simplified Drawdown calculation
    const losses = closedBets.filter(b => b.result === 'loss' || b.result === 'Perdida');
    const maxLoss = losses.length > 0 ? Math.max(...losses.map(l => parseFloat(l.stake || '0'))) : 0;
    const drawdown = balance > 0 ? ((maxLoss / balance) * 100).toFixed(1) : '0.0';

    return {
      totalProfitValue: totalProfit,
      totalProfit: totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      avgOdds,
      balance: balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      drawdown: `-${drawdown}%`,
      profitValue: totalProfit,
      count: closedBets.length
    };
  }, [bets, initialBankroll]);

  // Generate chart data based on last 15 days performance trend
  const dynamicChartData = React.useMemo(() => {
    // For a real app, this would group profits by date
    // For now, we'll map the last few bets to the chart bars to show activity
    return bets.slice(0, 15).reverse().map((b, i) => {
      const odd = parseFloat(b.odds || '0');
      const stake = parseFloat(b.stake || '0');
      const profit = b.result === 'win' ? (stake * (odd - 1)) : (b.result === 'loss' ? -stake : 0);
      return {
        name: b.date.split('/')[0],
        value: Math.abs(profit) || 50, // Fallback for visibility
        profit: b.result === 'win'
      };
    });
  }, [bets]);

  // Generate detailed analysis data based on context
  const analysisData = React.useMemo(() => {
    const historicalBets = [...bets].reverse();
    let cumulativeProfit = 0;
    
    return historicalBets.map((b, i) => {
      const odd = parseFloat(b.odds || '0');
      const stake = parseFloat(b.stake || '0');
      const bonus = parseFloat(b.bonusPercent || '0') || 0;
      const effectiveOdd = odd * (1 + bonus / 100);
      
      const profit = b.result === 'win' || b.result === 'Ganha' 
        ? stake * (effectiveOdd - 1) 
        : (b.result === 'loss' || b.result === 'Perdida' ? -stake : 0);
        
      cumulativeProfit += profit;
      
      return {
        name: b.date.split('/')[0] + '/' + b.date.split('/')[1],
        odds: odd,
        lucro: cumulativeProfit,
        stake: stake,
        roi: b.roi.replace('%', '').replace('+', '')
      };
    });
  }, [bets]);

  const analysisConfig = {
    'Odds': { color: 'var(--color-primary)', key: 'odds', label: 'Valor da Odd' },
    'Lucro': { color: 'var(--color-secondary)', key: 'lucro', label: 'Lucro Acumulado (R$)' },
    'Drawdown': { color: 'var(--color-error)', key: 'roi', label: 'Performance ROI (%)' },
    'Performance Financeira': { color: 'var(--color-secondary)', key: 'lucro', label: 'Evolução Patrimonial' },
    'Geral': { color: 'var(--color-primary)', key: 'lucro', label: 'Resultado' }
  };

  const currentAnalysis = analysisConfig[analysisContext as keyof typeof analysisConfig] || analysisConfig['Geral'];

  const handleDelete = (id: number) => {
    setBets(bets.filter(b => b.id !== id));
  };

  const handleEdit = (bet: BetData) => {
    setEditingBet(bet);
    setActiveView('register');
  };

  const onSaveBet = (betData: any) => {
    // Calculate ROI and Result Type based on data
    const oddsV = parseFloat(betData.odds) || 0;
    const bonusV = parseFloat(betData.bonusPercent || '0') || 0;
    const boostedV = oddsV * (1 + bonusV / 100);
    
    const roiValue = betData.result === 'win' 
      ? `+${((boostedV - 1) * 100).toFixed(0)}%` 
      : betData.result === 'loss' ? '-100%' : 'Pendente';

    if (editingBet) {
      setBets(bets.map(b => b.id === editingBet.id ? { 
        ...betData, 
        id: b.id, 
        type: betData.result === 'win' ? 'win' : betData.result === 'loss' ? 'loss' : 'win', 
        roi: roiValue 
      } : b));
      setEditingBet(null);
    } else {
      const newBet = {
        ...betData,
        id: Math.max(0, ...bets.map(b => b.id)) + 1,
        type: betData.result === 'win' ? 'win' : betData.result === 'loss' ? 'loss' : 'win',
        roi: roiValue
      };
      setBets([newBet, ...bets]);
    }
    setActiveView('history');
  };

  const navigateToAnalysis = (context: string) => {
    setAnalysisContext(context);
    setActiveView('analysis');
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
              <img 
                alt="User Profile Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANz3V1A1iflFa7bVeMqJ9nDgDogkZNKXPg0aDxZMcLQRapfzJOZ9siaxEY-BB9c0hImJxQaFbvGd_pRuSe-elbDT37tJQ9WRA3cdvD81kvicAqtbDFbOQyRgoG28IQUBuhxezbXts8xQsNeKdtjeI7nLxOqc0j0yu7OIGR4U4q0gzLYA3-4tFMBgFxWZRHK_H2xuizSwx_yzTvxav-T9k9_jqwFqSnX-iyc4bg0QKZplI2ddGCxr2YprSUNWJTU-rQxK35JkzoXeI"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="font-headline text-2xl font-bold text-primary">RD GERENCIAMENTO</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-primary">
            <Bell size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="font-label-mono text-primary uppercase tracking-widest">Performance</span>
                  <h2 className="font-headline-md text-on-surface">Análise de Resultados</h2>
                </div>
                <div className="inline-flex p-1 bg-surface-container rounded-lg border border-outline-variant">
                  <button className="px-4 py-2 font-label-mono rounded transition-colors bg-primary-container text-on-primary-container">Diário</button>
                  <button className="px-4 py-2 font-label-mono rounded transition-colors text-on-surface-variant hover:text-on-surface">Mensal</button>
                  <button className="px-4 py-2 font-label-mono rounded transition-colors text-on-surface-variant hover:text-on-surface">Anual</button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-5">
                <div 
                  onClick={() => navigateToAnalysis('Performance Financeira')}
                  className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-xl p-6 cursor-pointer hover:border-primary transition-all group"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                       <h3 className="font-label-mono text-on-surface-variant uppercase">Lucro/Prejuízo por Período</h3>
                       <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-secondary"></span>
                        <span className="font-label-mono text-on-surface-variant">Lucro</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-error"></span>
                        <span className="font-label-mono text-on-surface-variant">Prejuízo</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dynamicChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                          {dynamicChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.profit ? 'var(--color-secondary)' : 'var(--color-error)'} fillOpacity={entry.profit ? 1 : 0.6} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-6 flex flex-col justify-between border border-primary relative overflow-hidden group">
                  <div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-label-mono uppercase opacity-80">Saldo Consolidado</span>
                      <button 
                        onClick={() => setIsEditingBankroll(!isEditingBankroll)}
                        className="p-1 hover:bg-on-primary-container/10 rounded-full transition-colors text-on-primary-container"
                        title="Editar Banca Inicial"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                    {isEditingBankroll ? (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="font-label-mono text-[10px] uppercase opacity-70">Ajustar Banca Inicial</label>
                        <div className="flex gap-2 mt-1">
                          <input 
                            type="number" 
                            className="bg-on-primary-container/10 border border-on-primary-container/20 rounded px-2 py-1 text-on-primary-container w-full outline-none focus:border-on-primary-container"
                            value={initialBankroll}
                            onChange={(e) => setInitialBankroll(parseFloat(e.target.value) || 0)}
                            autoFocus
                          />
                          <button 
                            onClick={() => setIsEditingBankroll(false)}
                            className="bg-on-primary-container text-primary-container px-3 rounded font-bold text-xs uppercase"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="font-display-lg mt-2 relative z-10">{stats.balance}</div>
                    )}
                    <div className="mt-4 flex items-center gap-2 relative z-10">
                      <TrendingUp size={20} />
                      <span className="font-medium">Calculado sobre {stats.count} entradas</span>
                    </div>
                  </div>
                  <button className="w-full mt-8 bg-on-primary text-primary py-4 rounded-lg font-headline text-xs font-bold uppercase tracking-widest hover:brightness-110 relative z-10">
                    Exportar Relatório
                  </button>
                  {/* Decorative background element */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-on-primary-container/5 rounded-full blur-3xl group-hover:bg-on-primary-container/10 transition-colors" />
                </div>

                <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <MetricCard title="Média de Odds" value={stats.avgOdds} icon={<Calculator />} progress={65} description="Clique para analisar volatilidade." colorClass="primary" onClick={() => navigateToAnalysis('Odds')} />
                  <MetricCard title="Lucro Total" value={stats.totalProfit} icon={<CheckCircle />} status={stats.profitValue > 0 ? "Meta mensal batida" : "Em busca da meta"} colorClass="secondary" onClick={() => navigateToAnalysis('Lucro')} />
                  <MetricCard title="Drawdown Máximo" value={stats.drawdown} icon={<AlertTriangle />} progress={28} description="Clique para analisar riscos." colorClass="error" onClick={() => navigateToAnalysis('Drawdown')} />
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'register' && (
            <motion.div 
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <RegisterBet 
                onSave={onSaveBet} 
                initialData={editingBet} 
                onCancel={() => {
                  setEditingBet(null);
                  setActiveView('dashboard');
                }}
              />
            </motion.div>
          )}

          {activeView === 'analysis' && (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-label-mono text-primary uppercase tracking-widest">Analytics</span>
                  <h2 className="font-headline-md text-on-surface">Análise: {analysisContext}</h2>
                </div>
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className="font-label-mono text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 uppercase text-xs"
                >
                  <ArrowRight size={14} className="rotate-180" /> Voltar ao Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl p-6">
                   <div className="mb-6">
                      <h4 className="font-label-mono text-on-surface-variant uppercase text-xs">{currentAnalysis.label}</h4>
                   </div>
                   <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analysisData}>
                          <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={currentAnalysis.color} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={currentAnalysis.color} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--color-on-surface)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey={currentAnalysis.key} 
                            stroke={currentAnalysis.color} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorMetric)" 
                          />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                <div className="bg-surface-container border border-outline-variant rounded-xl p-8 flex flex-col justify-center items-center text-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    <TrendingUp size={48} />
                  </div>
                  <h4 className="font-headline-sm">Insights de {analysisContext}</h4>
                  <p className="text-on-surface-variant font-body-md leading-relaxed">
                    {analysisContext === 'Odds' ? 
                      "Sua maior rentabilidade está em odds entre 1.80 e 2.10. Evite odds abaixo de 1.50 para manter o ROI positivo a longo prazo." :
                      analysisContext === 'Lucro' ?
                      "O lucro acumulado mostra uma tendência de alta consistente. O gerenciamento de banca de 2% está protegendo seu capital eficientemente." :
                      analysisContext === 'Drawdown' ?
                      "Seu drawdown atual é de 8.2%. Este é um nível saudável para apostadores profissionais, mantendo a volatilidade sob controle." :
                      "Com base em seu histórico recente, sugerimos focar em mercados de handicap asiático para aumentar o ROI médio em 2.4%."
                    }
                  </p>
                  <div className="mt-4 pt-4 border-t border-outline-variant w-full">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-label-mono text-on-surface-variant uppercase">Volume de Dados</span>
                        <span className="text-sm font-bold text-on-surface">{bets.length} Apostas</span>
                     </div>
                     <div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${Math.min(100, bets.length * 2)}%` }}></div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-label-mono text-primary uppercase tracking-widest">Logs</span>
                  <h2 className="font-headline-md text-on-surface">Histórico de Performance</h2>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low">
                        <th className="px-6 py-4 font-label-mono text-on-surface-variant uppercase">Data</th>
                        <th className="px-6 py-4 font-label-mono text-on-surface-variant uppercase">Evento</th>
                        <th className="px-6 py-4 font-label-mono text-on-surface-variant uppercase">Mercado</th>
                        <th className="px-6 py-4 font-label-mono text-on-surface-variant uppercase">Resultado</th>
                        <th className="px-6 py-4 font-label-mono text-on-surface-variant uppercase text-right">ROI</th>
                        <th className="px-6 py-4 font-label-mono text-on-surface-variant uppercase text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {bets.map((item) => (
                        <tr key={item.id} className="hover:bg-surface-container-high transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                          <td className="px-6 py-4">{item.event}</td>
                          <td className="px-6 py-4">{item.market}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-1 rounded font-label-mono text-[10px] uppercase",
                              item.type === 'win' ? "bg-secondary/15 text-secondary" : "bg-error/15 text-error"
                            )}>
                              {item.result}
                            </span>
                          </td>
                          <td className={cn(
                            "px-6 py-4 font-label-mono text-right font-medium whitespace-nowrap",
                            item.type === 'win' ? "text-secondary" : "text-error"
                          )}>
                            {item.roi}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item);
                                }}
                                className="p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-all active:scale-90"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className="p-2 bg-error/10 text-error rounded hover:bg-error/20 transition-all active:scale-90"
                                title="Excluir"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface-container border-t border-outline-variant">
        <NavItem 
          active={activeView === 'dashboard'} 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem 
          active={activeView === 'register'} 
          icon={<PlusCircle />} 
          label="Register" 
          onClick={() => setActiveView('register')}
        />
        <NavItem 
          active={activeView === 'analysis'} 
          icon={<BarChart2 />} 
          label="Analysis" 
          colorClass="secondary" 
          onClick={() => setActiveView('analysis')}
        />
        <NavItem 
          active={activeView === 'history'} 
          icon={<History />} 
          label="History" 
          onClick={() => setActiveView('history')}
        />
      </nav>
    </div>
  );
}

function MetricCard({ title, value, icon, progress, status, description, colorClass, onClick }: any) {
  const colorMap: any = {
    primary: 'text-primary border-primary hover:border-primary',
    secondary: 'text-secondary border-secondary hover:border-secondary',
    error: 'text-error border-error hover:border-error',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn(
        "bg-surface-container border border-outline-variant rounded-xl p-6 transition-colors cursor-pointer group",
        colorMap[colorClass].split(' ').pop()
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-mono text-on-surface-variant uppercase">{title}</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
          </div>
          <div className={cn("font-headline-md mt-2", colorClass === 'secondary' ? 'text-secondary' : colorClass === 'error' ? 'text-error' : 'text-on-surface')}>
            {value}
          </div>
        </div>
        <div className={cn("w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center", colorMap[colorClass].split(' ')[0])}>
          {icon}
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-6 h-1 w-full bg-surface-container-lowest rounded-full overflow-hidden">
          <div 
            className={cn("h-full", colorClass === 'primary' ? 'bg-primary' : colorClass === 'error' ? 'bg-error' : 'bg-secondary')} 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {status && (
        <div className={cn("mt-6 flex items-center gap-2 font-label-mono", colorClass === 'secondary' ? 'text-secondary' : 'text-primary')}>
          {status}
        </div>
      )}

      {description && <p className="mt-4 text-sm text-on-surface-variant">{description}</p>}
    </motion.div>
  );
}

function NavItem({ icon, label, active, colorClass, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center transition-all cursor-pointer outline-none",
        active 
          ? colorClass === 'secondary' ? "text-secondary scale-110 font-bold" : "text-primary scale-110 font-bold" 
          : "text-on-surface-variant hover:text-primary"
      )}
    >
      <span className="mb-1">{icon}</span>
      <span className="font-label-mono text-[10px]">{label}</span>
    </button>
  );
}
