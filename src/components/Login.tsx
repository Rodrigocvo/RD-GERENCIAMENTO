import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail, resetPassword } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Mail, 
  Lock, 
  UserPlus, 
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err: any) {
      console.error("Auth error", err);
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      
      if (err.code === 'auth/wrong-password') errorMessage = "Senha incorreta.";
      if (err.code === 'auth/user-not-found') errorMessage = "Usuário não encontrado.";
      if (err.code === 'auth/email-already-in-use') errorMessage = "Este e-mail já está em uso.";
      if (err.code === 'auth/invalid-email') errorMessage = "E-mail inválido.";
      if (err.code === 'auth/weak-password') errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Digite seu e-mail para recuperar a senha.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setError(null);
    } catch (err) {
      setError("Erro ao enviar e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Zap size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white font-headline">RD Gerenciamento</h1>
          <p className="text-slate-400 font-body-md">Sua performance profissional em um só lugar.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {loading && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left"
            />
          )}

          <div className="space-y-6">
            <div className="flex bg-slate-950 p-1 rounded-xl gap-1">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-primary rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Senha</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={handleResetPassword}
                      className="text-[10px] text-primary hover:underline font-bold uppercase transition-all"
                    >
                      Esqueci a senha
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-primary rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20"
                  >
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="text-xs font-bold">{error}</span>
                  </motion.div>
                )}
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-4 rounded-2xl border border-emerald-400/20"
                  >
                    <ShieldCheck size={18} className="flex-shrink-0" />
                    <span className="text-xs font-bold">{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 px-6 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isLogin ? <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /> : <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />}
                    {isLogin ? 'Entrar Agora' : 'Criar Conta Grátis'}
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-col gap-4 text-left border-t border-slate-800 pt-6">
              <Feature icon={<ShieldCheck size={16} />} text="Seus dados estão protegidos" />
              <Feature icon={<Zap size={16} />} text="Analytics de alta performance" />
              <Feature icon={<Globe size={16} />} text="Sincronização entre aparelhos" />
            </div>

            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-label-mono text-center">
              Acesso Profissional RD Gerenciamento
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}
