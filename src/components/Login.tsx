import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LogIn, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Mail, 
  Lock, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const FIXED_EMAIL = 'meuemail@aqui.com';
const FIXED_PASS = '123456';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (email === FIXED_EMAIL && password === FIXED_PASS) {
        localStorage.setItem('rd_auth_token', 'logged_in');
        onLogin();
      } else {
        setError("E-mail ou senha incorretos.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Zap size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white font-headline">RD Gerenciamento</h1>
          <p className="text-slate-400 font-body-md">Acesso Restrito - Somente para o Proprietário.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-primary rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-primary rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20">
                <AlertCircle size={18} />
                <span className="text-xs font-bold">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 px-6 rounded-2xl font-bold hover:bg-slate-100 transition-all group disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} />Acessar Dashboard</>}
            </button>
          </form>

          <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 text-slate-400"><ShieldCheck size={16} className="text-primary"/><span className="text-xs font-medium">Sessão Local Segura</span></div>
            <div className="flex items-center gap-3 text-slate-400"><Zap size={16} className="text-primary"/><span className="text-xs font-medium">Sem Configuração Externa</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
