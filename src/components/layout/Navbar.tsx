"use client"
import { 
  Search, 
  UserCircle, 
  Bell, 
  Settings, 
  LogOut, 
  Key, 
  History, 
  CreditCard, 
  Check, 
  Info, 
  RefreshCw, 
  Sparkles,
  Flame,
  X,
  // Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface NavbarProps {
  onMenuClick: () => void;
  role?: 'admin' | 'guest';
}

export function Navbar({ onMenuClick, role = 'admin' }: NavbarProps) {
  const [pathname, setPathname] = useState('');
  const isGuest = role === 'guest';
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Interactive Menu States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [credits, setCredits] = useState<number>(50);
  
  const [username, setUsername] = useState('A. Vargas');
  const [guestId, setGuestId] = useState('');
  
  const [notifications, setNotifications] = useState<{
    id: string;
    title: string;
    desc: string;
    time: string;
    type: string;
    read: boolean;
  }[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  /*
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('govcheck:toggle-sidebar'));
  };
  */

  // Escuchar evento global para abrir modal de invitado
  useEffect(() => {
    const handleShowGuestModal = () => {
      setShowGuestModal(true);
    };
    window.addEventListener('show-guest-modal', handleShowGuestModal);
    return () => window.removeEventListener('show-guest-modal', handleShowGuestModal);
  }, []);

  // Permitimos a invitados navegar libremente por el portal y el historial en modo lectura sin redirección forzada

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('guest_welcome')) {
        setShowGuestModal(true);
        // Limpiar el parámetro de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Cargar usuario e id de invitado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isGuest) {
        let storedId = localStorage.getItem('govcheck_guest_id');
        if (!storedId) {
          storedId = Math.floor(1000 + Math.random() * 9000).toString();
          localStorage.setItem('govcheck_guest_id', storedId);
        }
        setGuestId(storedId);
      } else {
        const storedName = localStorage.getItem('govcheck_username');
        if (storedName) {
          setUsername(storedName);
        }
      }
    }
  }, [role, isGuest]);

  // Cargar notificaciones al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('govcheck_notifications');
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch (e) {
          const defaultNotifs = [
            {
              id: 'init-1',
              title: 'Portal Activo',
              desc: 'Conectado a los servicios de RENIEC, SUNAT y MTC en tiempo real.',
              time: 'Hace 5 min',
              type: 'info',
              read: false
            }
          ];
          setNotifications(defaultNotifs);
          localStorage.setItem('govcheck_notifications', JSON.stringify(defaultNotifs));
        }
      } else {
        const defaultNotifs = [
          {
            id: 'init-1',
            title: 'Portal Activo',
            desc: 'Conectado a los servicios de RENIEC, SUNAT y MTC en tiempo real.',
            time: 'Hace 5 min',
            type: 'info',
            read: false
          }
        ];
        setNotifications(defaultNotifs);
        localStorage.setItem('govcheck_notifications', JSON.stringify(defaultNotifs));
      }
    }
  }, []);

  // Escuchar evento de nueva notificación
  useEffect(() => {
    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail) return;
      const { title, desc, type, time = 'Ahora mismo' } = customEvent.detail;
      
      const newNotif = {
        id: Date.now().toString(),
        title,
        desc,
        time,
        type: type || 'info',
        read: false
      };

      setNotifications(prev => {
        const updated = [newNotif, ...prev].slice(0, 20); // Guardar máximo 20
        localStorage.setItem('govcheck_notifications', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('govcheck-notification', handleNewNotification);
    return () => window.removeEventListener('govcheck-notification', handleNewNotification);
  }, []);

  // Read credits cookie
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )user_credits=([^;]*)/);
    if (match) {
      setCredits(parseInt(match[1], 10));
    }
  }, [showProfileMenu]);

  // Click Outside to Close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('#notification-menu-btn') && !target.closest('#notification-dropdown')) {
        setShowNotifications(false);
      }
      if (!target.closest('#profile-menu-btn') && !target.closest('#profile-dropdown')) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('govcheck_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('govcheck_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRecharge = () => {
    const newCredits = credits + 50;
    setCredits(newCredits);
    document.cookie = `user_credits=${newCredits}; path=/; max-age=${60 * 60 * 24 * 30}`;
    
    // Disparar evento de notificación dinámico
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('govcheck-notification', {
        detail: {
          title: 'Créditos Recargados',
          desc: `Recargaste 50 créditos con éxito. Nuevo saldo: ${newCredits} créditos.`,
          type: 'credits'
        }
      }));
    }
  };

  return (
    <header className="h-20 glass-panel flex items-center justify-between px-4 lg:px-12 z-[var(--z-nav)] sticky top-0 border-b border-white/5">
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Mobile Menu Toggle - Disabled as Sidebar was removed
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/5 active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        */}

        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 lg:w-12 lg:h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src="/govcheck-logo.png" 
              alt="Servicios.pe Logo" 
              width={48} 
              height={48} 
              className="relative z-10 drop-shadow-2xl w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg lg:text-xl font-black text-white tracking-tighter leading-none">Servicios<span className="text-primary">.pe</span></h1>
            <p className="text-[9px] lg:text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Consultas y Trámites</p>
          </div>
        </a>

        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-[40vw] sm:max-w-none">
          {[
            { name: 'Portal', href: '/' },
            { name: 'Consola', href: '/console', badge: 'Beta' },
            { name: 'Historial', href: '/history' },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <a 
                key={item.href}
                href={item.href} 
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-1 py-0.5 rounded text-[7px] sm:text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider uppercase animate-pulse">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-4 relative">
          
          {/* Notification Button */}
          <div className="relative">
            <motion.button 
              id="notification-menu-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-all relative border ${
                showNotifications ? 'border-primary/50 text-white bg-white/10' : 'border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full ring-2 ring-black flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notification Dropdown Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  id="notification-dropdown"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full w-[280px] sm:w-96 bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-[var(--z-dropdown)] text-left"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Notificaciones</p>
                      {unreadCount > 0 && (
                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] text-zinc-400 hover:text-primary font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span className="hidden sm:inline">Marcar leídas</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 px-4 text-center">
                        <Info className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">No tenés notificaciones</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 hover:bg-white/5 border-b border-white/5 transition-colors relative flex gap-3 group ${
                            !n.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === 'success' ? 'bg-green-500/10 text-green-400' :
                            n.type === 'credits' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {n.type === 'success' && <Check className="w-4 h-4" />}
                            {n.type === 'credits' && <Flame className="w-4 h-4" />}
                            {n.type === 'info' && <Info className="w-4 h-4" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-3">
                              <p className={`text-xs font-bold text-white truncate ${!n.read ? 'pr-1' : ''}`}>{n.title}</p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-zinc-500 font-semibold">
                                  {n.time}
                                </span>
                                <button 
                                  onClick={(e) => clearNotification(n.id, e)}
                                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/20 p-1.5 rounded-full cursor-pointer flex items-center justify-center transition-colors border border-white/5 hover:border-red-500/10"
                                  title="Eliminar notificación"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{n.desc}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Trigger Button */}
          <div className="relative">
            <button 
              id="profile-menu-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-3 group cursor-pointer pl-2 sm:pl-4 border-l border-white/10 outline-none select-none text-left ${
                showProfileMenu ? 'text-primary' : ''
              }`}
            >
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-zinc-100 group-hover:text-primary transition-colors">
                   {isGuest ? `Invitado-${guestId}` : username}
                 </p>
                 <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest group-hover:text-primary/70 transition-colors">
                   {isGuest ? 'Acceso Limitado' : 'Administrador'}
                 </p>
               </div>
               <div className="relative">
                 <UserCircle className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                   showProfileMenu ? 'text-primary' : isGuest ? 'text-zinc-600 group-hover:text-primary' : 'text-zinc-500 group-hover:text-primary'
                 }`} />
                 {!isGuest && (
                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-black"></span>
                 )}
               </div>
            </button>

            {/* Profile Dropdown Panel */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  id="profile-dropdown"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full w-[280px] sm:w-80 bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-2xl p-4 text-left z-[var(--z-dropdown)]"
                >
                  {/* User Profile Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                      <UserCircle className={`w-7 h-7 sm:w-8 sm:h-8 ${isGuest ? 'text-zinc-500' : 'text-primary'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{isGuest ? `Usuario Invitado` : username}</p>
                      <p className="text-[10px] sm:text-xs text-zinc-500 truncate">{isGuest ? `invitado_${guestId}@servicios.pe` : `${username.toLowerCase().replace(/\s+/g, '.')}@servicios.pe`}</p>
                    </div>
                  </div>

                  {/* Credits & Subscription Options */}
                  {!isGuest ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-zinc-300">Créditos de API</span>
                        </div>
                        <span className="text-sm font-black text-white">{credits} <span className="text-[10px] text-zinc-500 font-bold">/ 500</span></span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${Math.min((credits / 500) * 100, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Plan Auto-Renovado</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-3 mb-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1 text-purple-400">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-black uppercase tracking-wider">Acceso Premium</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">Obtené búsquedas avanzadas de personas y vehiculos.</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Esta web es un demo, estamos trabajando en ello...");
                        }}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-2 rounded-lg transition-all active:scale-[0.98]"
                      >
                        Adquirir Licencia
                      </button>
                    </div>
                  )}

                  {/* Menu Options */}
                  <div className="space-y-1">
                    {!isGuest ? (
                      <>
                        <a href="/console" className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <div className="flex items-center gap-3">
                            <Key className="w-4 h-4 text-zinc-500" />
                            <span>Consola API</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider uppercase">
                            Beta
                          </span>
                        </a>
                        <a href="/history" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <History className="w-4 h-4 text-zinc-500" />
                          <span>Historial</span>
                        </a>
                      </>
                    ) : (
                      <a 
                        href="/history" 
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <History className="w-4 h-4 text-zinc-500" />
                        <span>Historial de Búsquedas</span>
                      </a>
                    )}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettingsModal(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-zinc-500" />
                      <span>Configuración</span>
                    </button>
                    
                    <div className="border-t border-white/5 my-2"></div>
                    
                    <a href="/logout" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Modal de Configuración de Cuenta */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {showSettingsModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowSettingsModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-left relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl"></div>

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configuración</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Ajustes del Portal</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-4">
                  {/* Nombre de Usuario (Para Admin) */}
                  {!isGuest && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nombre de Administrador</label>
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => {
                          const newName = e.target.value;
                          const cleanName = newName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.-]/g, '').slice(0, 30);
                          setUsername(cleanName);
                          localStorage.setItem('govcheck_username', cleanName);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold"
                        placeholder="Ej. A. Vargas"
                      />
                    </div>
                  )}

                  {/* Perfil de Invitado (Para Invitado) */}
                  {isGuest && (
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                      <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">Sesión de Invitado</span>
                      <p className="text-xs font-bold text-white mt-1">Identificador: <span className="text-primary font-mono">Invitado-{guestId}</span></p>
                      <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">Tu identificador es temporal pero persistente en tu navegador. Tus consultas no guardan registro en servidores.</p>
                    </div>
                  )}

                  {/* Opciones de Limpieza */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Almacenamiento Local</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de que querés vaciar todo tu historial de consultas?')) {
                            localStorage.removeItem('govcheck_search_history');
                            window.dispatchEvent(new Event('storage-updated')); // Refrescar historial
                            
                            window.dispatchEvent(new CustomEvent('govcheck-notification', {
                              detail: {
                                title: 'Historial Vaciado',
                                desc: 'El historial de búsquedas de este dispositivo fue eliminado.',
                                type: 'info'
                              }
                            }));
                            alert('Historial de búsquedas eliminado con éxito.');
                          }
                        }}
                        className="py-2.5 px-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/15 hover:border-red-500/25 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        Limpiar Historial
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('¿Querés restablecer las notificaciones por defecto?')) {
                            localStorage.removeItem('govcheck_notifications');
                            window.location.reload();
                          }
                        }}
                        className="py-2.5 px-3 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-300 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        Resetear Notificaciones
                      </button>
                    </div>
                  </div>

                  {/* Info de la Web */}
                  <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 space-y-1">
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-wider">Aviso Experimental</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">Este portal es experimental, demostrativo y con fines didácticos. El autor no recopila datos personales ni se responsabiliza por el uso de las APIs.</p>
                  </div>
                </div>

                {/* footer modal */}
                <button 
                  onClick={() => {
                    setShowSettingsModal(false);
                    
                    // Notificación de guardado
                    window.dispatchEvent(new CustomEvent('govcheck-notification', {
                      detail: {
                        title: 'Ajustes Aplicados',
                        desc: 'La configuración de tu cuenta se actualizó correctamente.',
                        type: 'success'
                      }
                    }));
                  }}
                  className="w-full bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]"
                >
                  Guardar y Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal de Invitación a Modo Premium (Invitado) */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {showGuestModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setShowGuestModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-left relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-28 h-28 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl"></div>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Acceso Completo</h3>
                      <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Demo Experimental Sin Costo</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowGuestModal(false)}
                    className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-4">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Estás navegando en <strong className="text-white">Modo Invitado</strong>. Esta sesión se encuentra limitada exclusivamente a la <strong className="text-white">visualización estructural</strong>.
                  </p>

                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/15 space-y-2">
                    <p className="text-[10px] text-primary font-black uppercase tracking-wider">¿Querés probar todas las funciones?</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Iniciá sesión con nuestras credenciales de prueba para interactuar con consultas reales de forma 100% gratuita.
                    </p>
                  </div>

                  {/* Caja de Credenciales */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Credenciales de Demostración</label>
                    <div className="grid grid-cols-2 gap-3 bg-black/50 p-3.5 rounded-2xl border border-white/5 font-mono text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Usuario Demo</span>
                        <span className="text-white font-bold block select-all">admin</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Contraseña</span>
                        <span className="text-white font-bold block select-all">admin123</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href="/login?autologin=true"
                    className="w-full bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] text-center flex items-center justify-center gap-2 group cursor-pointer border border-primary/20"
                  >
                    <span>Iniciar Sesión</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10 active:scale-[0.98] cursor-pointer"
                  >
                    Seguir como Invitado
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </header>
  );
}

