"use client"
import { useState, useEffect } from 'react';
import { 
  Search, Loader2, Coins, Clock, ArrowRight, Code, Cpu, 
  RefreshCw, CheckCircle2, ShieldAlert, Lock, Eye, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// ==========================================
// COPY BUTTON UTILITY COMPONENT
// ==========================================
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="p-1 rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 text-zinc-500 hover:border-white/10 transition-all cursor-pointer flex items-center justify-center shrink-0"
      title="Copiar al portapapeles"
    >
      {copied ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

interface ApiConsoleProps {
  hasJsonPeToken?: boolean;
}

export function ApiConsole({ hasJsonPeToken = false }: ApiConsoleProps) {
  // Estado de usuario y créditos
  const [role, setRole] = useState<'guest' | 'admin'>('guest');
  const [credits, setCredits] = useState<number>(50);
  const [recharging, setRecharging] = useState(false);
  const [rateLimitData, setRateLimitData] = useState({ count: 0, lastQuery: 0 });

  // Selección de consulta
  const [category, setCategory] = useState<'free' | 'paid'>('free');
  const [queryType, setQueryType] = useState<
    'dni' | 'license' | 'ruc' | 'ruc-debt' | 'plate' | 'soat'
  >('dni');
  const [inputValue, setInputValue] = useState('');
  
  // Estado de la búsqueda
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultData, setResultData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  // Cargar cookies al montar
  useEffect(() => {
    const token = getCookie('auth_token');
    const isGuestUser = token === 'guest-session-token';
    setRole(isGuestUser ? 'guest' : 'admin');
    
    // Auto-ajustar categoría para que por default esté en gratis/free
    setCategory('free');

    // Cargar créditos
    const userCredits = getCookie('user_credits');
    if (userCredits) {
      setCredits(parseInt(userCredits, 10));
    }

    // Cargar rate limit de invitado
    const limitCookie = getCookie('guest_rate_limit');
    if (limitCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(limitCookie));
        setRateLimitData({ count: parsed.count, lastQuery: parsed.lastQuery });
      } catch {}
    }
  }, []);

  // Recarga de créditos (Simulador)
  const handleRecharge = async () => {
    setRecharging(true);
    try {
      const res = await fetch('/api/credits/recharge', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCredits(data.credits);
        
        // Disparar evento de notificación dinámico
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('govcheck-notification', {
            detail: {
              title: 'Créditos Recargados (Consola)',
              desc: `Se acreditaron 50 créditos en tu cuenta. Nuevo saldo: ${data.credits} créditos.`,
              type: 'credits'
            }
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRecharging(false);
    }
  };


  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') {
      window.dispatchEvent(new CustomEvent('show-guest-modal'));
      return;
    }

    if (category === 'paid' && !hasJsonPeToken) {
      setSearchState('error');
      setErrorMessage('La consulta Premium está deshabilitada porque no se ha configurado el token de acceso en el servidor.');
      return;
    }

    const cleanedVal = inputValue.trim().toUpperCase();
    if (!cleanedVal) return;

    setSearchState('loading');
    setResultData(null);
    setErrorMessage('');

    // Pre-validación cliente
    if (category === 'free') {
      const freeTypes = ['dni', 'ruc', 'plate', 'soat'];
      if (!freeTypes.includes(queryType)) {
        setSearchState('error');
        setErrorMessage('La categoría gratuita no soporta esta consulta. Seleccioná Premium si tenés acceso habilitado.');
        return;
      }
      if (queryType === 'dni' && !/^\d{8}$/.test(cleanedVal)) {
        setSearchState('error');
        setErrorMessage('Formato inválido: El DNI debe contener exactamente 8 dígitos.');
        return;
      }
      if (queryType === 'ruc' && !/^\d{11}$/.test(cleanedVal)) {
        setSearchState('error');
        setErrorMessage('Formato inválido: El RUC debe contener exactamente 11 dígitos.');
        return;
      }
      if (queryType === 'plate' || queryType === 'soat') {
        if (cleanedVal.length < 5) {
          setSearchState('error');
          setErrorMessage('Formato inválido: Ingrese una placa vehicular válida.');
          return;
        }
      }
    } else {
      // Validaciones para Paid (json.pe)
      if (queryType === 'dni' || queryType === 'license') {
        if (!/^\d{8}$/.test(cleanedVal)) {
          setSearchState('error');
          setErrorMessage('Formato inválido: El DNI debe contener exactamente 8 dígitos.');
          return;
        }
      } else if (queryType === 'ruc' || queryType === 'ruc-debt') {
        if (!/^\d{11}$/.test(cleanedVal)) {
          setSearchState('error');
          setErrorMessage('Formato inválido: El RUC debe contener exactamente 11 dígitos.');
          return;
        }
      } else if (queryType === 'plate' || queryType === 'soat') {
        if (cleanedVal.length < 5) {
          setSearchState('error');
          setErrorMessage('Formato inválido: Ingrese una placa vehicular válida.');
          return;
        }
      }
    }

    try {
      const providerParam = category === 'free' ? 'eldni' : 'json_pe';
      let endpoint = queryType;
      let queryParam = '';

      if (queryType === 'dni' || queryType === 'license') {
        queryParam = `dni=${cleanedVal}`;
      } else if (queryType === 'ruc' || queryType === 'ruc-debt') {
        queryParam = `ruc=${cleanedVal}`;
      } else if (queryType === 'plate' || queryType === 'soat') {
        queryParam = `plate=${cleanedVal}`;
      }

      const res = await fetch(`/api/search/${endpoint}?${queryParam}&provider=${providerParam}`);
      const data = await res.json();

      refreshUserData();

      if (res.ok && data.success) {
        setResultData(data);
        setSearchState('success');

        // Disparar evento de notificación dinámico
        if (typeof window !== 'undefined') {
          let queryName = queryType.toUpperCase();
          if (queryType === 'ruc-debt') queryName = 'DEUDA COACTIVA';

          window.dispatchEvent(new CustomEvent('govcheck-notification', {
            detail: {
              title: `Consola API: ${queryName} Exitosa`,
              desc: `Consulta sobre "${cleanedVal}" realizada con éxito desde la consola.`,
              type: 'success'
            }
          }));
        }
      } else {
        setSearchState('error');
        const errorMsg = data.message || 'Error desconocido al procesar la consulta.';
        setErrorMessage(errorMsg);

        // Disparar evento de error
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('govcheck-notification', {
            detail: {
              title: `Consola API: Error en Consulta`,
              desc: `Fallo al consultar "${cleanedVal}": ${errorMsg}`,
              type: 'error'
            }
          }));
        }
      }
    } catch {
      setSearchState('error');
      setErrorMessage('Error crítico al conectar con el servidor.');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('govcheck-notification', {
          detail: {
            title: `Consola API: Fallo de Red`,
            desc: `Error crítico de red al consultar "${cleanedVal}".`,
            type: 'error'
          }
        }));
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* PANEL IZQUIERDO: Control y Saldo */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* CARD DE SALDO / LIMITACIONES */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          
          {role === 'admin' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <Coins className="w-5 h-5 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Saldo de Créditos</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{credits}</span>
                <span className="text-zinc-500 text-sm font-bold">créditos</span>
              </div>
              
              
              <button
                onClick={handleRecharge}
                disabled={recharging}
                className="w-full bg-white/5 hover:bg-white/10 disabled:bg-zinc-800 text-zinc-200 hover:text-white font-bold py-3 px-4 rounded-xl border border-white/5 transition-all text-xs flex items-center justify-center gap-2"
              >
                {recharging ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Recargar Créditos
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Límites de Invitado</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-xs text-zinc-400 font-semibold">Rate Limit:</span>
                  <span className="text-xs text-primary font-bold">10 seg entre consultas</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-xs text-zinc-400 font-semibold">Consumo por hora:</span>
                  <span className="text-xs text-primary font-bold">{rateLimitData.count} / 5 consultas</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                Consultando el servicio público para evitar bloqueos temporales del API del estado, se aplica restricción de consultas.
              </p>
            </div>
          )}
        </div>

        {/* SELECTOR DE CATEGORÍA */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Proveedor de Servicio</label>
          <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => {
                if (role !== 'admin') {
                  window.dispatchEvent(new CustomEvent('show-guest-modal'));
                  return;
                }
                setCategory('free');
                const freeTypes = ['dni', 'ruc', 'plate', 'soat'];
                if (!freeTypes.includes(queryType)) {
                  setQueryType('dni');
                }
              }}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                category === 'free'
                  ? 'bg-white/10 text-white border border-white/5'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
                <span className="font-bold">Gratuito</span>
              <span className="text-[9px] uppercase tracking-widest text-primary font-semibold">SIN COSTO</span>
            </button>
            
            <button
              onClick={() => {
                if (role !== 'admin') {
                  window.dispatchEvent(new CustomEvent('show-guest-modal'));
                  return;
                }
                if (!hasJsonPeToken) {
                  return;
                }
                setCategory('paid');
              }}
              disabled={!hasJsonPeToken}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 relative ${
                category === 'paid'
                  ? 'bg-white/10 text-white border border-white/5'
                  : 'text-zinc-500 hover:text-zinc-300'
              } ${(!hasJsonPeToken || role !== 'admin') ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="font-bold flex items-center gap-1">
                Premium
                {(!hasJsonPeToken || role !== 'admin') && <Lock className="w-3 h-3 text-zinc-500" />}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-semibold">
                {hasJsonPeToken ? 'CON COSTO' : 'SIN TOKEN'}
              </span>
            </button>
          </div>
        </div>

        {/* SELECTOR DE CONSULTAS */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Tipo de Consulta</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'dni', name: 'DNI (Identidad)', group: 'Identidad', cost: 1, freeAllowed: true },
              { id: 'ruc', name: 'RUC (Empresa)', group: 'RUC', cost: 1, freeAllowed: true },
              { id: 'plate', name: 'Placa (Vehículo)', group: 'Vehículo', cost: 2, freeAllowed: true },
              { id: 'soat', name: 'SOAT Vehicular', group: 'Vehículo', cost: 1, freeAllowed: true },
              { id: 'license', name: 'Licencia de Conducir', group: 'Identidad', cost: 1, freeAllowed: false },
              { id: 'ruc-debt', name: 'Deuda Coactiva', group: 'RUC', cost: 1, freeAllowed: false },
            ].map((item) => {
              const isSelected = queryType === item.id;
              const isAllowed = (category === 'paid' && hasJsonPeToken) || item.freeAllowed;
              
              return (
                <button
                  key={item.id}
                  disabled={!isAllowed}
                  onClick={() => {
                    if (role !== 'admin') {
                      window.dispatchEvent(new CustomEvent('show-guest-modal'));
                      return;
                    }
                    setQueryType(item.id as any);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between border ${
                    isSelected 
                      ? 'bg-primary/20 text-white border-primary/40 shadow-sm' 
                      : isAllowed
                        ? 'bg-white/5 text-zinc-300 border-transparent hover:bg-white/10'
                        : 'bg-zinc-900/50 text-zinc-700 border-transparent opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="flex items-center gap-1">
                    {category === 'free' ? (
                      item.freeAllowed ? (
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold uppercase">Gratis</span>
                      ) : (
                        <span className="text-[9px] bg-zinc-800 text-zinc-600 px-2 py-0.5 rounded-md font-bold uppercase">
                          {!hasJsonPeToken ? 'Falta Token' : 'Bloqueado'}
                        </span>
                      )
                    ) : (
                      <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold uppercase">
                        -{item.cost} {item.cost === 1 ? 'crédito' : 'créditos'}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* PANEL DERECHO: Formulario e Inspector de Resultados */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* INPUT DE CONEXIÓN */}
        <div className="glass-panel p-6 rounded-3xl">
          <form onSubmit={handleQuery} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Ingresá el identificador para la consulta
              </label>
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder={
                      queryType === 'dni' || queryType === 'license'
                        ? "Ingresá DNI (ej. 43234567)"
                        : queryType === 'ruc' || queryType === 'ruc-debt'
                          ? "Ingresá RUC (ej. 20123456789)"
                          : "Ingresá Placa (ej. ABC-1234)"
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchState === 'loading'}
                  className="bg-primary hover:bg-blue-600 disabled:bg-zinc-800 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {searchState === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Consultar API
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* CONSOLA DE RESULTADOS */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 flex flex-col min-h-[480px]">
          {/* Cabecera de la Consola */}
          <div className="bg-black/30 px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
              </div>
              <span className="text-xs text-zinc-500 font-mono tracking-widest">CONSOLE://API_RESPONSE</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  activeTab === 'visual'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  activeTab === 'json'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Raw JSON
              </button>
            </div>
          </div>

          {/* Cuerpo de la Consola */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {searchState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 space-y-4"
                >
                  <Cpu className="w-12 h-12 text-zinc-800 mx-auto" />
                  <div>
                    <h4 className="text-zinc-400 font-bold">Consola Lista</h4>
                    <p className="text-xs text-zinc-600 max-w-sm mx-auto mt-1 font-medium">
                      Elegí un proveedor, seleccioná el tipo de consulta, colocá el identificador y ejecutá tu llamada.
                    </p>
                  </div>
                </motion.div>
              )}

              {searchState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 space-y-4"
                >
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                  <div>
                    <h4 className="text-zinc-200 font-bold">Conectando con servidores oficiales...</h4>
                    <p className="text-xs text-zinc-500 mt-1 font-medium animate-pulse">Consultando base de datos oficial...</p>
                  </div>
                </motion.div>
              )}

              {searchState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex gap-4"
                >
                  <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-500 text-sm">Error al Consultar API</h4>
                    <p className="text-xs text-red-400/80 mt-1 leading-relaxed">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              {searchState === 'success' && resultData && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col justify-between"
                >
                  {activeTab === 'visual' ? (
                    <div className="space-y-6">
                      {/* Cabecera del Reporte */}
                      <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Consulta Exitosa</h4>
                          {/*<p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                            Proveedor: <span className="text-primary">{resultData.data.proveedor || resultData.provider}</span>
                          </p>*/}
                        </div>
                      </div>

                      {/* Renderizado de los campos según la consulta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 sm:p-5 rounded-2xl border border-white/5">
                        {Object.entries(resultData.data)
                          .filter(([key]) => key !== 'proveedor')
                          .map(([key, val]: any) => {
                            const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                            return (
                              <div key={key} className="space-y-1 min-w-0">
                                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest truncate">{key.replace('_', ' ')}</p>
                                <div className="flex items-center justify-between gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5 overflow-hidden">
                                  <span className="text-xs text-zinc-200 font-semibold font-mono break-all pr-2">
                                    {stringVal}
                                  </span>
                                  <CopyButton text={stringVal} />
                                </div>
                              </div>
                            );
                          })}
                      </div>


                      {/* Notificación de Créditos Restantes */}
                      {resultData.newCredits !== undefined && (
                        <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex justify-between items-center">
                          <span className="text-xs text-amber-500 font-semibold">Créditos remanentes en cuenta:</span>
                          <span className="text-xs text-white font-bold bg-amber-500/20 px-3 py-1 rounded-lg">
                            {resultData.newCredits} créditos
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col space-y-3">
                      <div className="flex justify-end">
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(JSON.stringify(resultData, null, 2));
                              window.dispatchEvent(new CustomEvent('govcheck-notification', {
                                detail: {
                                  title: 'JSON Copiado',
                                  desc: 'El JSON completo ha sido copiado al portapapeles.',
                                  type: 'success'
                                }
                              }));
                            } catch {}
                          }}
                          className="px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copiar JSON Completo
                        </button>
                      </div>
                      <pre className="flex-1 bg-black/50 p-4 rounded-2xl text-xs text-green-400 font-mono overflow-auto border border-white/5 max-h-[360px] scrollbar-thin">
                        {JSON.stringify(resultData, null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
