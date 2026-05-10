import React from 'react';
import { loginWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Login() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Zap size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white font-headline">RD Gerenciamento</h1>
          <p className="text-slate-400 font-body-md">Sua performance profissional em um só lugar.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 text-left">
              <Feature icon={<ShieldCheck size={18} />} text="Sincronização em nuvem segura" />
              <Feature icon={<Zap size={18} />} text="Analytics em tempo real" />
              <Feature icon={<Globe size={18} />} text="Acesse de qualquer dispositivo" />
            </div>

            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 px-6 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 group"
            >
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              Entrar com Google
            </button>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-label-mono">
              Ao entrar você aceita nossos termos de uso
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
