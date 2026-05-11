import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  Calendar, 
  Target, 
  TrendingUp, 
  Hash, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface BetData {
  id?: string;
  date: string;
  event: string;
  market: string;
  odds: string;
  stake: string;
  result: string;
  bonusPercent?: string;
}

interface RegisterBetProps {
  onSave: (bet: any) => void;
  onCancel?: () => void;
  initialData?: any | null;
}

export default function RegisterBet({ onSave, onCancel, initialData }: RegisterBetProps) {
  const [formData, setFormData] = useState<any>(initialData || {
    date: new Date().toISOString().split('T')[0],
    event: '',
    market: '',
    odds: '',
    stake: '',
    result: 'pending',
    bonusPercent: '0'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calculations
  const oddsNum = parseFloat(formData.odds) || 0;
  const stakeNum = parseFloat(formData.stake) || 0;
  const bonusPct = parseFloat(formData.bonusPercent || '0') || 0;
  
  const boostedOdds = oddsNum > 0 ? oddsNum * (1 + bonusPct / 100) : 0;
  const expectedProfit = (boostedOdds > 1 && stakeNum > 0) ? (stakeNum * (boostedOdds - 1)).toFixed(2) : '0.00';
  const expectedReturn = (boostedOdds > 0 && stakeNum > 0) ? (stakeNum * boostedOdds).toFixed(2) : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Salvamento local é instantâneo
    onSave(formData);
    
    setIsSubmitting(false);
    setSuccess(true);
    
    if (!initialData) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        event: '',
        market: '',
        odds: '',
        stake: '',
        result: 'pending',
        bonusPercent: '0'
      });
    }
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <span className="font-label-mono text-primary uppercase tracking-widest">{initialData ? 'Edição' : 'Lançamento'}</span>
          <h2 className="font-headline-md text-on-surface">{initialData ? 'Editar Aposta' : 'Registrar Nova Aposta'}</h2>
        </div>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-on-surface-variant hover:text-on-surface font-label-mono uppercase tracking-wider"
          >
            Cancelar
          </button>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container border border-outline-variant rounded-xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                <Calendar size={14} /> Data do Evento
              </label>
              <input 
                type="date" 
                required
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <label className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                <Target size={14} /> Evento / Partida
              </label>
              <input 
                type="text" 
                placeholder="Ex: Real Madrid vs Dortmund"
                required
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={formData.event}
                onChange={(e) => setFormData({...formData, event: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market */}
            <div className="space-y-2">
              <label className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                <Hash size={14} /> Mercado
              </label>
              <input 
                type="text" 
                placeholder="Ex: Over 2.5 Goals"
                required
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={formData.market}
                onChange={(e) => setFormData({...formData, market: e.target.value})}
              />
            </div>

            {/* Odds */}
            <div className="space-y-2">
              <label className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                <TrendingUp size={14} /> Odds
              </label>
              <input 
                type="number" 
                step="0.01"
                placeholder="1.85"
                required
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={formData.odds}
                onChange={(e) => setFormData({...formData, odds: e.target.value})}
              />
            </div>
          </div>

          {/* Stake & Boost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                R$ Stake (Montante)
              </label>
              <input 
                type="number" 
                placeholder="100.00"
                required
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors font-headline text-xl"
                value={formData.stake}
                onChange={(e) => setFormData({...formData, stake: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2">
                Bônus da Casa (%)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 pr-10 text-on-surface focus:outline-none focus:border-secondary transition-colors"
                  value={formData.bonusPercent}
                  onChange={(e) => setFormData({...formData, bonusPercent: e.target.value})}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-mono">%</span>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Display */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-lg">
            <div className="text-center md:text-left">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase block">Odd Efetiva</span>
              <span className="font-headline-sm text-secondary">{boostedOdds.toFixed(2)}</span>
            </div>
            <div className="text-center md:text-right">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase block">Lucro Esperado</span>
              <span className="font-headline-sm text-primary">R$ {expectedProfit}</span>
            </div>
          </div>

          {/* Result Buttons */}
          <div className="space-y-3">
            <label className="font-label-mono text-on-surface-variant uppercase">Status Inicial</label>
            <div className="grid grid-cols-3 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, result: 'pending'})}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                  formData.result === 'pending' 
                    ? "bg-surface-container-highest border-primary text-primary" 
                    : "bg-surface-container-low border-outline-variant text-on-surface-variant"
                )}
              >
                <Clock size={16} /> Pendente
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, result: 'win'})}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                  formData.result === 'win' 
                    ? "bg-secondary/10 border-secondary text-secondary" 
                    : "bg-surface-container-low border-outline-variant text-on-surface-variant"
                )}
              >
                <CheckCircle2 size={16} /> Ganha
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, result: 'loss'})}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                  formData.result === 'loss' 
                    ? "bg-error/10 border-error text-error" 
                    : "bg-surface-container-low border-outline-variant text-on-surface-variant"
                )}
              >
                <XCircle size={16} /> Perdida
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline text-lg font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{initialData ? 'Atualizar Dados' : 'Salvar Aposta'} <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 p-4 bg-secondary/15 border border-secondary text-secondary rounded-lg flex items-center gap-3 overflow-hidden"
            >
              <CheckCircle2 size={24} />
              <span className="font-medium">Aposta registrada com sucesso!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
