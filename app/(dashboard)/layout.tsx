'use client'

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-400/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => {}} />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          {children}
        </main>

        <footer className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <p>© {new Date().getFullYear()} GovCheck - Plataforma de Inteligencia Vehicular</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
          </div>
        </footer>
      </div>
    </div>
  );
}


