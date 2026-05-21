import { c as createComponent } from './astro-component_DNiUXFEw.mjs';
import 'piccolore';
import { a5 as addAttribute, b6 as renderHead, b7 as renderSlot, ba as renderTemplate } from './params-and-props_CvnwIJai.mjs';
import { r as renderComponent } from './server_Uic00SnP.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Bell, Check, Info, Flame, X, UserCircle, CreditCard, Sparkles, Key, History, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
/* empty css                  */

function Navbar({ onMenuClick, role = "admin" }) {
  const [pathname, setPathname] = useState("");
  const isGuest = role === "guest";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [credits, setCredits] = useState(50);
  const [username, setUsername] = useState("A. Vargas");
  const [guestId, setGuestId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  useEffect(() => {
    const handleShowGuestModal = () => {
      setShowGuestModal(true);
    };
    window.addEventListener("show-guest-modal", handleShowGuestModal);
    return () => window.removeEventListener("show-guest-modal", handleShowGuestModal);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("guest_welcome")) {
        setShowGuestModal(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isGuest) {
        let storedId = localStorage.getItem("govcheck_guest_id");
        if (!storedId) {
          storedId = Math.floor(1e3 + Math.random() * 9e3).toString();
          localStorage.setItem("govcheck_guest_id", storedId);
        }
        setGuestId(storedId);
      } else {
        const storedName = localStorage.getItem("govcheck_username");
        if (storedName) {
          setUsername(storedName);
        }
      }
    }
  }, [role, isGuest]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("govcheck_notifications");
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch (e) {
          const defaultNotifs = [
            {
              id: "init-1",
              title: "Portal Activo",
              desc: "Conectado a los servicios de RENIEC, SUNAT y MTC en tiempo real.",
              time: "Hace 5 min",
              type: "info",
              read: false
            }
          ];
          setNotifications(defaultNotifs);
          localStorage.setItem("govcheck_notifications", JSON.stringify(defaultNotifs));
        }
      } else {
        const defaultNotifs = [
          {
            id: "init-1",
            title: "Portal Activo",
            desc: "Conectado a los servicios de RENIEC, SUNAT y MTC en tiempo real.",
            time: "Hace 5 min",
            type: "info",
            read: false
          }
        ];
        setNotifications(defaultNotifs);
        localStorage.setItem("govcheck_notifications", JSON.stringify(defaultNotifs));
      }
    }
  }, []);
  useEffect(() => {
    const handleNewNotification = (e) => {
      const customEvent = e;
      if (!customEvent.detail) return;
      const { title, desc, type, time = "Ahora mismo" } = customEvent.detail;
      const newNotif = {
        id: Date.now().toString(),
        title,
        desc,
        time,
        type: type || "info",
        read: false
      };
      setNotifications((prev) => {
        const updated = [newNotif, ...prev].slice(0, 20);
        localStorage.setItem("govcheck_notifications", JSON.stringify(updated));
        return updated;
      });
    };
    window.addEventListener("govcheck-notification", handleNewNotification);
    return () => window.removeEventListener("govcheck-notification", handleNewNotification);
  }, []);
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )user_credits=([^;]*)/);
    if (match) {
      setCredits(parseInt(match[1], 10));
    }
  }, [showProfileMenu]);
  useEffect(() => {
    function handleClickOutside(event) {
      const target = event.target;
      if (!target.closest("#notification-menu-btn") && !target.closest("#notification-dropdown")) {
        setShowNotifications(false);
      }
      if (!target.closest("#profile-menu-btn") && !target.closest("#profile-dropdown")) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("govcheck_notifications", JSON.stringify(updated));
      return updated;
    });
  };
  const clearNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("govcheck_notifications", JSON.stringify(updated));
      return updated;
    });
  };
  return /* @__PURE__ */ jsxs("header", { className: "h-20 glass-panel flex items-center justify-between px-4 lg:px-12 z-30 sticky top-0 border-b border-white/5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2 group", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/govcheck-logo.png",
              alt: "Servicios.pe Logo",
              width: 48,
              height: 48,
              className: "relative z-10 drop-shadow-2xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:block", children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-xl font-black text-white tracking-tighter leading-none", children: [
            "Servicios",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: ".pe" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1", children: "Consultas y Trámites" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5", children: [
        { name: "Portal", href: "/" },
        { name: "Consola API", href: "/console", badge: "Beta" },
        { name: "Historial", href: "/history" }
      ].map((item) => {
        const isActive = pathname === item.href;
        return /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.href,
            className: `px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${isActive ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: item.name }),
              item.badge && /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider uppercase animate-pulse", children: item.badge })
            ]
          },
          item.href
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            id: "notification-menu-btn",
            onClick: () => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            },
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className: `p-2.5 hover:bg-white/10 rounded-xl transition-all relative border ${showNotifications ? "border-primary/50 text-white bg-white/10" : "border-white/5 text-zinc-400 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }),
              unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 w-3 h-3 bg-primary rounded-full ring-2 ring-black flex items-center justify-center text-[8px] font-black text-white animate-pulse", children: unreadCount })
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: showNotifications && /* @__PURE__ */ jsxs(
          motion.div,
          {
            id: "notification-dropdown",
            initial: { opacity: 0, y: 15, scale: 0.98 },
            animate: { opacity: 1, y: 8, scale: 1 },
            exit: { opacity: 0, y: 15, scale: 0.98 },
            transition: { duration: 0.15, ease: "easeOut" },
            className: "absolute right-0 top-full w-80 sm:w-96 bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 text-left",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-white/5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: "Notificaciones" }),
                  unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold", children: [
                    unreadCount,
                    " nuevas"
                  ] })
                ] }),
                unreadCount > 0 && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: markAllAsRead,
                    className: "text-[10px] text-zinc-400 hover:text-primary font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
                      "Marcar como leídas"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "max-h-[320px] overflow-y-auto", children: notifications.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-10 px-4 text-center", children: [
                /* @__PURE__ */ jsx(Info, { className: "w-8 h-8 text-zinc-600 mx-auto mb-2" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-zinc-500 uppercase tracking-wider", children: "No tenés notificaciones" })
              ] }) : notifications.map((n) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `p-4 hover:bg-white/5 border-b border-white/5 transition-colors relative flex gap-3 group ${!n.read ? "bg-primary/5" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === "success" ? "bg-green-500/10 text-green-400" : n.type === "credits" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"}`, children: [
                      n.type === "success" && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
                      n.type === "credits" && /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4" }),
                      n.type === "info" && /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-3", children: [
                        /* @__PURE__ */ jsx("p", { className: `text-xs font-bold text-white truncate ${!n.read ? "pr-1" : ""}`, children: n.title }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500 font-semibold", children: n.time }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => clearNotification(n.id, e),
                              className: "text-zinc-500 hover:text-red-400 hover:bg-red-500/20 p-1.5 rounded-full cursor-pointer flex items-center justify-center transition-colors border border-white/5 hover:border-red-500/10",
                              title: "Eliminar notificación",
                              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-400 mt-1 leading-relaxed", children: n.desc })
                    ] })
                  ]
                },
                n.id
              )) })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            id: "profile-menu-btn",
            onClick: () => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            },
            className: `flex items-center gap-3 group cursor-pointer pl-4 border-l border-white/10 outline-none select-none text-left ${showProfileMenu ? "text-primary" : ""}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "text-right hidden sm:block", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-zinc-100 group-hover:text-primary transition-colors", children: isGuest ? `Invitado-${guestId}` : username }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 uppercase font-bold tracking-widest group-hover:text-primary/70 transition-colors", children: isGuest ? "Acceso Limitado" : "Administrador" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(UserCircle, { className: `w-10 h-10 transition-colors ${showProfileMenu ? "text-primary" : isGuest ? "text-zinc-600 group-hover:text-primary" : "text-zinc-500 group-hover:text-primary"}` }),
                !isGuest && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-black" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: showProfileMenu && /* @__PURE__ */ jsxs(
          motion.div,
          {
            id: "profile-dropdown",
            initial: { opacity: 0, y: 15, scale: 0.98 },
            animate: { opacity: 1, y: 8, scale: 1 },
            exit: { opacity: 0, y: 15, scale: 0.98 },
            transition: { duration: 0.15, ease: "easeOut" },
            className: "absolute right-0 top-full w-80 bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-2xl p-4 text-left z-50",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pb-4 border-b border-white/5 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(UserCircle, { className: `w-8 h-8 ${isGuest ? "text-zinc-500" : "text-primary"}` }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: isGuest ? `Usuario Invitado` : username }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: isGuest ? `invitado_${guestId}@servicios.pe` : `${username.toLowerCase().replace(/\s+/g, ".")}@servicios.pe` })
                ] })
              ] }),
              !isGuest ? /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4 flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-300", children: "Créditos de API" })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-white", children: [
                    credits,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500 font-bold", children: "/ 500" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full bg-white/5 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "bg-primary h-full transition-all duration-500", style: { width: `${Math.min(credits / 500 * 100, 100)}%` } }) }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mt-1", children: /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold uppercase tracking-wider", children: "Plan Auto-Renovado" }) })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-3 mb-4 text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5 mb-1 text-purple-400", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-purple-400" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-wider", children: "Acceso Premium" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-400 leading-relaxed mb-3", children: "Obtené búsquedas vehiculares ilimitadas y consola para desarrolladores." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      alert("Simulación de suscripción Premium. ¡Gracias por tu interés!");
                    },
                    className: "w-full bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-2 rounded-lg transition-all active:scale-[0.98]",
                    children: "Adquirir Licencia"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                !isGuest ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("a", { href: "/console", className: "flex items-center justify-between px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(Key, { className: "w-4 h-4 text-zinc-500" }),
                      /* @__PURE__ */ jsx("span", { children: "Claves y Consola API" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-wider uppercase animate-pulse", children: "Beta" })
                  ] }),
                  /* @__PURE__ */ jsxs("a", { href: "/history", className: "flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all", children: [
                    /* @__PURE__ */ jsx(History, { className: "w-4 h-4 text-zinc-500" }),
                    /* @__PURE__ */ jsx("span", { children: "Historial de Búsquedas" })
                  ] })
                ] }) : /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "/history",
                    onClick: () => {
                      setShowProfileMenu(false);
                    },
                    className: "flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all",
                    children: [
                      /* @__PURE__ */ jsx(History, { className: "w-4 h-4 text-zinc-500" }),
                      /* @__PURE__ */ jsx("span", { children: "Historial de Búsquedas" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setShowSettingsModal(true);
                      setShowProfileMenu(false);
                    },
                    className: "w-full text-left flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 text-zinc-500" }),
                      /* @__PURE__ */ jsx("span", { children: "Configuración de Cuenta" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "border-t border-white/5 my-2" }),
                /* @__PURE__ */ jsxs("a", { href: "/logout", className: "flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all", children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Cerrar Sesión" })
                ] })
              ] })
            ]
          }
        ) })
      ] })
    ] }) }),
    mounted && typeof window !== "undefined" && createPortal(
      /* @__PURE__ */ jsx(AnimatePresence, { children: showSettingsModal && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md",
          style: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(12px)"
          },
          onClick: () => setShowSettingsModal(false),
          children: /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { scale: 0.95, y: 15 },
              animate: { scale: 1, y: 0 },
              exit: { scale: 0.95, y: 15 },
              className: "w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-left relative overflow-hidden",
              style: {
                position: "relative",
                margin: "auto"
              },
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/5 rounded-xl border border-white/10", children: /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-primary" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-wider", children: "Configuración" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-bold uppercase tracking-wider", children: "Ajustes del Portal" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowSettingsModal(false),
                      className: "p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-full text-zinc-400 hover:text-white transition-colors",
                      children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  !isGuest && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-zinc-400 uppercase tracking-widest", children: "Nombre de Administrador" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: username,
                        onChange: (e) => {
                          const newName = e.target.value;
                          setUsername(newName);
                          localStorage.setItem("govcheck_username", newName);
                        },
                        className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold",
                        placeholder: "Ej. A. Vargas"
                      }
                    )
                  ] }),
                  isGuest && /* @__PURE__ */ jsxs("div", { className: "bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-black uppercase tracking-wider", children: "Sesión de Invitado" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-white mt-1", children: [
                      "Identificador: ",
                      /* @__PURE__ */ jsxs("span", { className: "text-primary font-mono", children: [
                        "Invitado-",
                        guestId
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-semibold leading-relaxed", children: "Tu identificador es temporal pero persistente en tu navegador. Tus consultas no guardan registro en servidores." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-zinc-400 uppercase tracking-widest", children: "Almacenamiento Local" }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => {
                            if (confirm("¿Estás seguro de que querés vaciar todo tu historial de consultas?")) {
                              localStorage.removeItem("govcheck_search_history");
                              window.dispatchEvent(new Event("storage-updated"));
                              window.dispatchEvent(new CustomEvent("govcheck-notification", {
                                detail: {
                                  title: "Historial Vaciado",
                                  desc: "El historial de búsquedas de este dispositivo fue eliminado.",
                                  type: "info"
                                }
                              }));
                              alert("Historial de búsquedas eliminado con éxito.");
                            }
                          },
                          className: "py-2.5 px-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/15 hover:border-red-500/25 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center",
                          children: "Limpiar Historial"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => {
                            if (confirm("¿Querés restablecer las notificaciones por defecto?")) {
                              localStorage.removeItem("govcheck_notifications");
                              window.location.reload();
                            }
                          },
                          className: "py-2.5 px-3 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-300 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center",
                          children: "Resetear Notificaciones"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-amber-500 font-black uppercase tracking-wider", children: "Aviso Experimental" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-400 leading-relaxed", children: "Este portal es experimental, demostrativo y con fines didácticos. El autor no recopila datos personales ni se responsabiliza por el uso de las APIs. Fue creado para facilitar el acceso a consultas útiles en un solo lugar." })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      setShowSettingsModal(false);
                      window.dispatchEvent(new CustomEvent("govcheck-notification", {
                        detail: {
                          title: "Ajustes Aplicados",
                          desc: "La configuración de tu cuenta se actualizó correctamente.",
                          type: "success"
                        }
                      }));
                    },
                    className: "w-full bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]",
                    children: "Guardar y Cerrar"
                  }
                )
              ]
            }
          )
        }
      ) }),
      document.body
    ),
    mounted && typeof window !== "undefined" && createPortal(
      /* @__PURE__ */ jsx(AnimatePresence, { children: showGuestModal && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md",
          style: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)"
          },
          onClick: () => setShowGuestModal(false),
          children: /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { scale: 0.95, y: 15 },
              animate: { scale: 1, y: 0 },
              exit: { scale: 0.95, y: 15 },
              className: "w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-left relative overflow-hidden",
              style: {
                position: "relative",
                margin: "auto"
              },
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-28 h-28 bg-primary/20 rounded-full blur-2xl animate-pulse" }),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -mb-10 -ml-10 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-white/5 pb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-primary animate-pulse" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-white uppercase tracking-wider", children: "Acceso Completo" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] text-primary font-bold uppercase tracking-wider", children: "Demo Experimental Sin Costo" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowGuestModal(false),
                      className: "p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer",
                      children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-300 leading-relaxed", children: [
                    "Estás navegando en ",
                    /* @__PURE__ */ jsx("strong", { className: "text-white", children: "Modo Invitado" }),
                    ". Para resguardar la estabilidad y evitar saturaciones, esta sesión se encuentra limitada exclusivamente a la ",
                    /* @__PURE__ */ jsx("strong", { className: "text-white", children: "visualización estructural de la Consola API" }),
                    "."
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 rounded-2xl p-4 border border-primary/15 space-y-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-primary font-black uppercase tracking-wider", children: "¿Querés probar todas las funciones?" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-zinc-400 leading-relaxed", children: "Iniciá sesión con nuestras credenciales de prueba para interactuar con consultas de DNI, SUNAT, placas SUNARP, SOAT vehicular y licencias en tiempo real de forma 100% gratuita y libre de tarjetas de crédito." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-zinc-400 uppercase tracking-widest", children: "Credenciales de Demostración" }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 bg-black/50 p-3.5 rounded-2xl border border-white/5 font-mono text-xs", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold uppercase tracking-wider", children: "Usuario Demo" }),
                        /* @__PURE__ */ jsx("span", { className: "text-white font-bold block select-all", children: "admin" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold uppercase tracking-wider", children: "Contraseña" }),
                        /* @__PURE__ */ jsx("span", { className: "text-white font-bold block select-all", children: "admin123" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 pt-2", children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: "/login?autologin=true",
                      className: "w-full bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] text-center flex items-center justify-center gap-2 group cursor-pointer border border-primary/20",
                      children: [
                        /* @__PURE__ */ jsx("span", { children: "Iniciar Sesión con Demo" }),
                        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M14 5l7 7m0 0l-7 7m7-7H3" }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowGuestModal(false),
                      className: "w-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10 active:scale-[0.98] cursor-pointer",
                      children: "Seguir en Modo Invitado (Solo Lectura)"
                    }
                  )
                ] })
              ]
            }
          )
        }
      ) }),
      document.body
    )
  ] });
}

const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { title } = Astro2.props;
  const authCookie = Astro2.cookies.get("auth_token")?.value;
  const role = authCookie === "guest-session-token" ? "guest" : "admin";
  if (role === "admin" && !Astro2.cookies.has("user_credits")) {
    Astro2.cookies.set("user_credits", "50", {
      path: "/",
      httpOnly: false,
      secure: true,
      maxAge: 60 * 60 * 24 * 30
    });
  }
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="description" content="Portal unificado de servicios y consultas del Estado Peruano"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/govcheck-logo.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} | Servicios.pe</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="antialiased min-h-screen bg-background text-foreground"> <div class="relative min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-white"> <!-- Decorative Background Elements --> <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden"> <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div> <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style="animation-delay: 2s;"></div> <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-400/5 blur-[100px]"></div> </div> <div class="relative z-10 flex flex-col min-h-screen"> ${renderComponent($$result, "Navbar", Navbar, { "client:load": true, "role": role, "onMenuClick": (() => {
  }), "client:component-hydration": "load", "client:component-path": "C:/PROYECTOS/govcheck/src/components/layout/Navbar", "client:component-export": "Navbar" })} <main class="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest"> <div class="flex items-center gap-2"> <div class="w-6 h-6 bg-primary/20 rounded flex items-center justify-center"> <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div> </div> <p>© ${(/* @__PURE__ */ new Date()).getFullYear()} Servicios.pe - Portal de Consultas Ciudadanas</p> </div> <div class="flex gap-8"> <a href="/terms" class="hover:text-primary transition-colors">Términos</a> <a href="/privacy" class="hover:text-primary transition-colors">Privacidad</a> <a href="/support" class="hover:text-primary transition-colors">Soporte</a> </div> </footer> </div> </div></body></html>`;
}, "C:/PROYECTOS/govcheck/src/layouts/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };
