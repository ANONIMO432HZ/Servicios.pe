import Image from 'next/image';
import { login } from '../actions/auth';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-container-light">
      <div className="absolute inset-0 z-0">
         <Image 
           src="https://picsum.photos/seed/govcheckbg/1920/1080"
           alt="City background"
           fill
           priority
           referrerPolicy="no-referrer"
           className="object-cover blur-sm opacity-60"
         />
      </div>

      <div className="relative z-10 bg-surface/90 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-lg border border-outline-variant w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-8">
           <div className="bg-primary/10 p-3 rounded-full mb-4">
             <Lock className="w-8 h-8 text-primary" />
           </div>
           <h1 className="font-display-lg text-3xl font-semibold text-on-surface text-center tracking-tight">GovCheck</h1>
           <p className="font-body-md text-on-surface-variant text-center mt-2">Plataforma de Consulta Institucional</p>
        </div>

        <form action={login} className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="font-label-md font-medium text-on-surface">Usuario Institucional</label>
            <input 
              id="username"
              name="username"
              type="text" 
              placeholder="Ej. jperez@mpfn.gob.pe" 
              required
              className="px-4 py-3 bg-surface-light border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant transition-shadow"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="font-label-md font-medium text-on-surface">Contraseña</label>
            <input 
              id="password"
              name="password"
              type="password" 
              placeholder="••••••••" 
              required
              className="px-4 py-3 bg-surface-light border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant transition-shadow"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-primary text-on-primary font-label-md font-medium rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Ingresar al Sistema
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center">
           <p className="font-label-sm text-on-surface-variant text-xs">
             Acceso restringido a personal autorizado. El uso indebido de esta plataforma será sancionado de acuerdo a ley.
           </p>
        </div>
      </div>
    </div>
  );
}
